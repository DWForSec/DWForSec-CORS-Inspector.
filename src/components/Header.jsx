import { motion } from 'framer-motion';
import { Shield, Radar, Fingerprint } from 'lucide-react';

export default function Header() {
  return (
    <header className="relative py-10 md:py-16 px-4 overflow-hidden text-center">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-neon-purple/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        {/* Logo area */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="relative">
            <Shield className="w-10 h-10 text-neon-blue" />
            <div className="absolute inset-0 w-10 h-10 bg-neon-blue/20 rounded-full blur-lg animate-pulse-glow" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">
            <span className="text-white">DWForSec</span>
            <span className="text-neon-blue glow-text">-CORS-Inspector</span>
          </h1>
        </div>

        <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
          Ethical CORS Configuration Security Testing Tool
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {[
            { icon: Radar, text: 'Header Analysis' },
            { icon: Fingerprint, text: 'Origin Reflection' },
            { icon: Shield, text: 'Risk Assessment' },
          ].map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-blue/5 border border-neon-blue/10 text-xs text-slate-400"
            >
              <Icon className="w-3.5 h-3.5 text-neon-blue" />
              <span>{text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
