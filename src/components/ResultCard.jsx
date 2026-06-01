import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ShieldAlert, ShieldCheck, ShieldX,
  Globe, Fingerprint, Server, Hash,
  Eye, EyeOff, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle, Info, Wrench
} from 'lucide-react';

const RISK_CONFIG = {
  SAFE: {
    label: 'SAFE',
    badgeClass: 'badge-safe',
    glowClass: 'glow-green',
    borderColor: 'border-green-500/30',
    icon: ShieldCheck,
    iconColor: 'text-green-400',
    description: 'No CORS misconfiguration detected. The origin is not reflected or allowed.',
  },
  REVIEW: {
    label: 'REVIEW',
    badgeClass: 'badge-review',
    glowClass: 'glow-yellow',
    borderColor: 'border-yellow-500/30',
    icon: Shield,
    iconColor: 'text-yellow-400',
    description: 'CORS headers present with a specific allowed origin. Verify the allowlist policy is intentional.',
  },
  'HIGH RISK': {
    label: 'HIGH RISK',
    badgeClass: 'badge-high-risk',
    glowClass: 'glow-orange',
    borderColor: 'border-orange-500/30',
    icon: ShieldAlert,
    iconColor: 'text-orange-400',
    description: 'Wildcard (*) Access-Control-Allow-Origin detected. Any origin can read the response.',
  },
  'CRITICAL MISCONFIGURATION': {
    label: 'CRITICAL MISCONFIGURATION',
    badgeClass: 'badge-critical',
    glowClass: 'glow-red',
    borderColor: 'border-red-500/30',
    icon: ShieldX,
    iconColor: 'text-red-400',
    description: 'The server reflects the attacker\'s origin AND allows credentials. This enables full cross-origin data theft.',
  },
};

const RECOMMENDED_FIXES = [
  'Do not use wildcard (*) origin for sensitive endpoints.',
  'Do not use Access-Control-Allow-Credentials: true with untrusted origins.',
  'Use a strict origin allowlist.',
  'Validate the Origin header server-side.',
  'Separate public and authenticated API endpoints.',
];

export default function ResultCard({ result }) {
  const [showPreview, setShowPreview] = useState(false);
  const [showHeaders, setShowHeaders] = useState(true);
  const [showFixes, setShowFixes] = useState(true);

  const risk = RISK_CONFIG[result.riskLevel] || RISK_CONFIG.SAFE;
  const RiskIcon = risk.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`mt-8 glass-card rounded-2xl overflow-hidden ${risk.glowClass} animate-slide-up`}
    >
      {/* Risk Level Banner */}
      <div className={`px-6 py-4 border-b ${risk.borderColor} bg-gradient-to-r from-transparent via-cyber-800/50 to-transparent`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <RiskIcon className={`w-6 h-6 ${risk.iconColor}`} />
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${risk.badgeClass}`}>
                {risk.label}
              </span>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            HTTP {result.statusCode}
          </span>
        </div>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">{risk.description}</p>
      </div>

      {/* Request Info */}
      <div className="px-6 py-4 border-b border-cyber-600/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-start gap-2">
            <Globe className="w-4 h-4 text-neon-blue mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Target URL</p>
              <p className="text-sm text-slate-300 font-mono break-all">{result.targetUrl}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Fingerprint className="w-4 h-4 text-neon-purple mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Tested Origin</p>
              <p className="text-sm text-slate-300 font-mono break-all">{result.testedOrigin}</p>
            </div>
          </div>
        </div>
      </div>

      {/* CORS Headers */}
      <div className="px-6 py-4 border-b border-cyber-600/30">
        <button
          onClick={() => setShowHeaders(!showHeaders)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-neon-green" />
            <span className="text-sm font-semibold text-slate-300">CORS Headers</span>
          </div>
          {showHeaders ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showHeaders && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-3 rounded-lg bg-cyber-800/50 border border-cyber-600/20 overflow-hidden"
          >
            <table className="w-full text-xs">
              <tbody>
                {Object.entries(result.corsHeaders).map(([key, value]) => (
                  <tr key={key} className="header-row border-b border-cyber-700/30 last:border-0">
                    <td className="px-4 py-2.5 text-slate-500 font-mono whitespace-nowrap w-1/3 align-top">
                      {key}
                    </td>
                    <td className="px-4 py-2.5 font-mono break-all align-top">
                      <HeaderValue headerKey={key} value={value} riskLevel={result.riskLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>

      {/* Response Preview Toggle */}
      {result.bodyPreview !== undefined && (
        <div className="px-6 py-4 border-b border-cyber-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {showPreview ? (
                <Eye className="w-4 h-4 text-neon-blue" />
              ) : (
                <EyeOff className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-sm font-semibold text-slate-300">Show Response Preview</span>
              <span className="text-xs text-slate-600">(max 500 chars)</span>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`toggle-switch ${showPreview ? 'active' : ''}`}
              aria-label="Toggle response preview"
            />
          </div>

          {showPreview && result.bodyPreview && (
            <motion.pre
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-4 rounded-lg bg-cyber-900/80 border border-cyber-600/20 text-xs text-slate-400 font-mono overflow-x-auto code-block whitespace-pre-wrap break-all max-h-48"
            >
              {result.bodyPreview}
            </motion.pre>
          )}
        </div>
      )}

      {/* Recommended Fixes */}
      <div className="px-6 py-4">
        <button
          onClick={() => setShowFixes(!showFixes)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-neon-blue" />
            <span className="text-sm font-semibold text-slate-300">Recommended Fixes</span>
          </div>
          {showFixes ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {showFixes && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 space-y-2"
          >
            {RECOMMENDED_FIXES.map((fix, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-neon-blue flex-shrink-0 mt-0.5" />
                <span>{fix}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.div>
  );
}

function HeaderValue({ headerKey, value, riskLevel }) {
  if (value === null || value === undefined || value === '') {
    return <span className="text-slate-600 italic">not present</span>;
  }

  const key = headerKey.toLowerCase();
  
  // Highlight dangerous values
  if (key === 'access-control-allow-origin') {
    if (value === '*') {
      return <span className="text-orange-400 font-bold">* <span className="text-orange-400/60 font-normal">(wildcard — any origin)</span></span>;
    }
    if (riskLevel === 'CRITICAL MISCONFIGURATION') {
      return <span className="text-red-400 font-bold">{value} <span className="text-red-400/60 font-normal">(reflected attacker origin)</span></span>;
    }
    return <span className="text-yellow-300">{value}</span>;
  }

  if (key === 'access-control-allow-credentials' && value === 'true') {
    const isCritical = riskLevel === 'CRITICAL MISCONFIGURATION';
    return (
      <span className={isCritical ? 'text-red-400 font-bold' : 'text-yellow-300'}>
        true {isCritical && <span className="text-red-400/60 font-normal">(credentials exposed)</span>}
      </span>
    );
  }

  return <span className="text-slate-300">{value}</span>;
}
