import express from 'express';
import cors from 'cors';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting: 1 request per 2 seconds per IP
const analysisLimiter = rateLimit({
  windowMs: 2000,
  max: 1,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Rate limit exceeded. Please wait 2 seconds between requests.',
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CORS Analysis endpoint
app.post('/api/analyze-cors', analysisLimiter, async (req, res) => {
  const { targetUrl, origin, method } = req.body;

  // Validate input
  if (!targetUrl || !origin || !method) {
    return res.status(400).json({
      error: 'Missing required fields: targetUrl, origin, method',
    });
  }

  // Validate URL format
  if (!/^https?:\/\//i.test(targetUrl)) {
    return res.status(400).json({
      error: 'targetUrl must start with http:// or https://',
    });
  }

  // Validate method
  const allowedMethods = ['GET', 'POST', 'OPTIONS'];
  if (!allowedMethods.includes(method.toUpperCase())) {
    return res.status(400).json({
      error: `Invalid method. Allowed: ${allowedMethods.join(', ')}`,
    });
  }

  try {
    let response;
    const requestConfig = {
      timeout: 10000, // 10 second timeout
      maxRedirects: 5,
      validateStatus: () => true, // Accept all status codes
      headers: {
        'Origin': origin,
        'User-Agent': 'DWForSec-CORS-Inspector/1.0',
      },
    };

    if (method.toUpperCase() === 'OPTIONS') {
      // Preflight request
      requestConfig.method = 'OPTIONS';
      requestConfig.url = targetUrl;
      requestConfig.headers = {
        ...requestConfig.headers,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization, content-type',
      };
      response = await axios(requestConfig);
    } else {
      requestConfig.method = method.toUpperCase();
      requestConfig.url = targetUrl;
      response = await axios(requestConfig);
    }

    const headers = response.headers;

    // Extract CORS-relevant headers
    const corsHeaders = {
      'access-control-allow-origin': headers['access-control-allow-origin'] || null,
      'access-control-allow-credentials': headers['access-control-allow-credentials'] || null,
      'access-control-allow-methods': headers['access-control-allow-methods'] || null,
      'access-control-allow-headers': headers['access-control-allow-headers'] || null,
      'vary': headers['vary'] || null,
      'server': headers['server'] || null,
      'content-type': headers['content-type'] || null,
    };

    // Determine risk level
    const riskLevel = analyzeRisk(corsHeaders, origin);

    // Body preview (max 500 chars, only if present)
    let bodyPreview = null;
    if (response.data) {
      const bodyStr = typeof response.data === 'string'
        ? response.data
        : JSON.stringify(response.data, null, 2);
      bodyPreview = bodyStr.substring(0, 500);
      if (bodyStr.length > 500) {
        bodyPreview += '\n... [truncated]';
      }
    }

    res.json({
      targetUrl,
      testedOrigin: origin,
      method: method.toUpperCase(),
      statusCode: response.status,
      corsHeaders,
      riskLevel,
      bodyPreview,
    });

  } catch (err) {
    // Handle specific error types
    if (err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT') {
      return res.status(408).json({
        error: 'Request timed out after 10 seconds.',
      });
    }

    if (err.code === 'ENOTFOUND') {
      return res.status(400).json({
        error: `Host not found: ${targetUrl}`,
      });
    }

    if (err.code === 'ECONNREFUSED') {
      return res.status(400).json({
        error: `Connection refused by target: ${targetUrl}`,
      });
    }

    return res.status(500).json({
      error: `Analysis failed: ${err.message}`,
    });
  }
});

/**
 * Analyze CORS risk level based on response headers.
 * 
 * Risk levels:
 * - SAFE: No ACAO header or origin not allowed
 * - REVIEW: Specific origin is allowed
 * - HIGH RISK: Wildcard (*) ACAO
 * - CRITICAL MISCONFIGURATION: Reflects attacker origin + credentials = true
 */
function analyzeRisk(corsHeaders, testedOrigin) {
  const acao = corsHeaders['access-control-allow-origin'];
  const acac = corsHeaders['access-control-allow-credentials'];

  // No ACAO header at all = SAFE
  if (!acao) {
    return 'SAFE';
  }

  // ACAO reflects the tested attacker origin AND credentials are allowed
  if (acao === testedOrigin && acac === 'true') {
    return 'CRITICAL MISCONFIGURATION';
  }

  // Wildcard origin
  if (acao === '*') {
    return 'HIGH RISK';
  }

  // Specific origin is allowed (could be legitimate or misconfigured)
  return 'REVIEW';
}

app.listen(PORT, () => {
  console.log(`\n  🛡️  DWForSec-CORS-Inspector Backend`);
  console.log(`  ➜  Server running at http://localhost:${PORT}`);
  console.log(`  ➜  Endpoint: POST /api/analyze-cors`);
  console.log(`  ➜  Rate limit: 1 request / 2 seconds per IP`);
  console.log(`  ➜  Timeout: 10 seconds\n`);
});
