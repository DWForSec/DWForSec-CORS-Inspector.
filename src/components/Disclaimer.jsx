import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function Disclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="glass-card rounded-xl p-4 mb-8 border-l-4 border-neon-yellow"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="text-yellow-400 font-semibold text-sm mb-1">Responsible Use Disclaimer</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            This tool is intended only for <span className="text-yellow-300 font-medium">authorized security testing</span>,{' '}
            <span className="text-yellow-300 font-medium">education</span>, and{' '}
            <span className="text-yellow-300 font-medium">responsible security research</span>.
            Do not test systems without permission.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
