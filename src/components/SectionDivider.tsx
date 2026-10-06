import { motion } from 'framer-motion';

export function SectionDivider({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-4 py-8 select-none">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent to-katana-crimson/50 origin-right"
      />
      <motion.div
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="w-2 h-2 bg-katana-crimson rotate-45" />
        <div className="absolute inset-0 w-2 h-2 bg-katana-crimson rotate-45 blur-sm opacity-60" />
      </motion.div>
      <div className="text-katana-crimson/60 font-cinematic text-sm tracking-[0.3em] uppercase">
        {label || '\u2726'}
      </div>
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-16 sm:w-24 bg-gradient-to-l from-transparent to-katana-crimson/50 origin-left"
      />
    </div>
  );
}
