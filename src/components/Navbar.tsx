import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/data/content';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 ${
          scrolled
            ? 'bg-katana-black/90 backdrop-blur-md border-b border-katana-crimson/20 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <motion.button
            onClick={() => scrollTo('hero')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="font-display font-700 text-katana-bone text-lg tracking-[0.2em] hover:text-katana-crimson transition-colors relative"
          >
            <span className="relative z-10">KPHB<span className="text-katana-crimson">KATANA</span></span>
            <motion.span
              className="absolute inset-0 blur-sm opacity-0 hover:opacity-100"
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-katana-crimson">KPHBKATANA</span>
            </motion.span>
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="px-3 py-1.5 font-body text-xs uppercase tracking-widest text-katana-silver/60 hover:text-katana-crimson transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-katana-bone p-2"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[199] bg-katana-black/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center gap-4"
          >
            {NAV_ITEMS.map((item, i) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => scrollTo(item.id)}
                className="font-display text-2xl uppercase tracking-[0.2em] text-katana-bone/80 hover:text-katana-crimson transition-colors"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
