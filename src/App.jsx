import { useState } from 'react';
import Header from './components/Header';
import Disclaimer from './components/Disclaimer';
import CorsForm from './components/CorsForm';
import ResultCard from './components/ResultCard';
import Footer from './components/Footer';

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async ({ targetUrl, origin, method }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/analyze-cors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUrl, origin, method }),
      });

      // Check if response is JSON before parsing
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          `Backend returned non-JSON response (${response.status}). ` +
          'Make sure the backend server is running (npm run server).'
        );
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to backend. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-900 bg-grid-pattern scanline-effect">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <Header />
        <Disclaimer />
        <CorsForm onAnalyze={handleAnalyze} loading={loading} />
        
        {error && (
          <div className="mt-6 glass-card rounded-xl p-4 border-l-4 border-red-500 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <p className="text-red-400 font-mono text-sm">{error}</p>
            </div>
          </div>
        )}

        {result && <ResultCard result={result} />}
        <Footer />
      </div>
    </div>
  );
}
