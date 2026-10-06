import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: ScrollRevealProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();

  const offsets = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: -60 },
    right: { y: 0, x: 60 },
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
