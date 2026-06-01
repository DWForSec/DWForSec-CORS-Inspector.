import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Send, ChevronDown, Zap, Loader2 } from 'lucide-react';

const PRESET_ORIGINS = [
  { label: 'https://evil.example', value: 'https://evil.example' },
  { label: 'https://attacker.example', value: 'https://attacker.example' },
  { label: 'null', value: 'null' },
  { label: 'https://example.com', value: 'https://example.com' },
];

const HTTP_METHODS = ['GET', 'POST', 'OPTIONS'];

export default function CorsForm({ onAnalyze, loading }) {
  const [targetUrl, setTargetUrl] = useState('');
  const [origin, setOrigin] = useState('');
  const [method, setMethod] = useState('GET');
  const [urlError, setUrlError] = useState('');

  const validateUrl = (url) => {
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      return 'URL must start with http:// or https://';
    }
    try {
      new URL(url);
      return '';
    } catch {
      return 'Invalid URL format';
    }
  };

  const handleUrlChange = (e) => {
    const val = e.target.value;
    setTargetUrl(val);
    setUrlError(validateUrl(val));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validateUrl(targetUrl);
    if (err) {
      setUrlError(err);
      return;
    }
    if (!origin.trim()) return;
    onAnalyze({ targetUrl: targetUrl.trim(), origin: origin.trim(), method });
  };

  const isValid = targetUrl.trim() && origin.trim() && !urlError && !loading;

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="glass-card rounded-2xl p-6 md:p-8 glow-blue"
    >
      {/* Target URL */}
      <div className="mb-6">
        <label htmlFor="target-url" className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
          <Globe className="w-4 h-4 text-neon-blue" />
          Target Endpoint
        </label>
        <input
          id="target-url"
          type="text"
          value={targetUrl}
          onChange={handleUrlChange}
          placeholder="https://example.com/api"
          className={`w-full cyber-input rounded-lg px-4 py-3 text-sm font-mono text-slate-200 placeholder:text-slate-600 ${
            urlError ? 'border-red-500/50' : ''
          }`}
        />
        {urlError && (
          <p className="mt-1.5 text-xs text-red-400 font-mono">{urlError}</p>
        )}
      </div>

      {/* Origin + Method Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Origin Input */}
        <div className="md:col-span-2">
          <label htmlFor="origin-input" className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <Zap className="w-4 h-4 text-neon-purple" />
            Origin Header
          </label>
          <input
            id="origin-input"
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="https://evil.example or enter custom origin"
            className="w-full cyber-input rounded-lg px-4 py-3 text-sm font-mono text-slate-200 placeholder:text-slate-600"
          />
        </div>

        {/* Method */}
        <div>
          <label htmlFor="method-select" className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
            <ChevronDown className="w-4 h-4 text-neon-green" />
            Method
          </label>
          <select
            id="method-select"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full cyber-select rounded-lg px-4 py-3 text-sm font-mono"
          >
            {HTTP_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Origins */}
      <div className="mb-6">
        <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Preset Origins</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_ORIGINS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setOrigin(value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 ${
                origin === value
                  ? 'bg-neon-blue/20 border border-neon-blue/50 text-neon-blue shadow-sm shadow-neon-blue/10'
                  : 'bg-cyber-700/50 border border-cyber-500/30 text-slate-400 hover:border-neon-blue/30 hover:text-slate-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        type="submit"
        disabled={!isValid}
        className="w-full btn-primary rounded-xl px-6 py-3.5 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing CORS Configuration...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Analyze CORS
          </>
        )}
      </button>
    </motion.form>
  );
}
