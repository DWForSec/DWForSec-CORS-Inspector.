import { motion } from 'framer-motion';
import { Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-12 py-8 border-t border-cyber-700/30 text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-neon-blue/50" />
        <span className="text-sm text-slate-500 font-medium">
          DWForSec-CORS-Inspector
        </span>
        <span className="text-xs text-slate-600">v1.0.0</span>
      </div>
      <p className="text-xs text-slate-600 flex items-center justify-center gap-1">
        Built with <Heart className="w-3 h-3 text-red-500/50" /> for ethical security research
      </p>
      <p className="text-xs text-slate-700 mt-2">
        MIT License — For authorized testing only
      </p>
    </motion.footer>
  );
}
