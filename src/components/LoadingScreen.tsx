import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDone(true);
            setTimeout(onComplete, 600);
          }, 300);
          return 100;
        }
        return p + Math.random() * 15 + 5;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] bg-katana-black flex flex-col items-center justify-center bg-grain"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-8"
          >
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <path
                d="M10 50 L45 10 L50 15 L15 55 Z"
                fill="none"
                stroke="#c8102e"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M45 10 L50 5 L55 10 L50 15 Z" fill="#c8102e" />
              <line x1="10" y1="50" x2="5" y2="55" stroke="#d4af37" strokeWidth="2" />
            </svg>
          </motion.div>

          <div className="text-katana-crimson font-display text-xl tracking-[0.4em] uppercase mb-6 text-glow-crimson">
            Loading the Legend
          </div>

          <div className="w-64 h-0.5 bg-katana-ash overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-katana-blood to-katana-crimson"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>

          <div className="mt-3 text-katana-silver/40 font-body text-xs tracking-widest">
            {Math.min(Math.floor(progress), 100)}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
