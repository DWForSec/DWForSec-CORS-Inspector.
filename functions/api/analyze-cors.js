export async function onRequestPost(context) {
  const { request } = context;

  // CORS headers for the function itself
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json();
    const { targetUrl, origin, method } = body;

    // Validate input
    if (!targetUrl || !origin || !method) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: targetUrl, origin, method' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      return new Response(
        JSON.stringify({ error: 'targetUrl must start with http:// or https://' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const allowedMethods = ['GET', 'POST', 'OPTIONS'];
    if (!allowedMethods.includes(method.toUpperCase())) {
      return new Response(
        JSON.stringify({ error: `Invalid method. Allowed: ${allowedMethods.join(', ')}` }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Build request headers
    const requestHeaders = {
      'Origin': origin,
      'User-Agent': 'DWForSec-CORS-Inspector/1.0',
    };

    if (method.toUpperCase() === 'OPTIONS') {
      requestHeaders['Access-Control-Request-Method'] = 'POST';
      requestHeaders['Access-Control-Request-Headers'] = 'authorization, content-type';
    }

    // Send request to target
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(targetUrl, {
        method: method.toUpperCase(),
        headers: requestHeaders,
        redirect: 'follow',
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Request timed out after 10 seconds.' }),
          { status: 408, headers: corsHeaders }
        );
      }
      return new Response(
        JSON.stringify({ error: `Connection failed: ${fetchErr.message}` }),
        { status: 502, headers: corsHeaders }
      );
    }
    clearTimeout(timeout);

    // Extract CORS headers
    const respHeaders = response.headers;
    const extractedCorsHeaders = {
      'access-control-allow-origin': respHeaders.get('access-control-allow-origin') || null,
      'access-control-allow-credentials': respHeaders.get('access-control-allow-credentials') || null,
      'access-control-allow-methods': respHeaders.get('access-control-allow-methods') || null,
      'access-control-allow-headers': respHeaders.get('access-control-allow-headers') || null,
      'vary': respHeaders.get('vary') || null,
      'server': respHeaders.get('server') || null,
      'content-type': respHeaders.get('content-type') || null,
    };

    // Risk analysis
    const riskLevel = analyzeRisk(extractedCorsHeaders, origin);

    // Body preview (max 500 chars)
    let bodyPreview = null;
    try {
      const bodyText = await response.text();
      if (bodyText) {
        bodyPreview = bodyText.substring(0, 500);
        if (bodyText.length > 500) {
          bodyPreview += '\n... [truncated]';
        }
      }
    } catch {
      bodyPreview = '[Unable to read response body]';
    }

    return new Response(
      JSON.stringify({
        targetUrl,
        testedOrigin: origin,
        method: method.toUpperCase(),
        statusCode: response.status,
        corsHeaders: extractedCorsHeaders,
        riskLevel,
        bodyPreview,
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: `Analysis failed: ${err.message}` }),
      { status: 500, headers: corsHeaders }
    );
  }
}

// Handle OPTIONS preflight for the function endpoint itself
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function analyzeRisk(corsHeaders, testedOrigin) {
  const acao = corsHeaders['access-control-allow-origin'];
  const acac = corsHeaders['access-control-allow-credentials'];

  if (!acao) return 'SAFE';
  if (acao === testedOrigin && acac === 'true') return 'CRITICAL MISCONFIGURATION';
  if (acao === '*') return 'HIGH RISK';
  return 'REVIEW';
}
