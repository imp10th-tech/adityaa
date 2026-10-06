import { useEffect, useState } from 'react';

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    document.body.classList.add('katana-cursor-active');

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.body.classList.remove('katana-cursor-active');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      <div
        className="fixed pointer-events-none z-[9999] mix-blend-difference"
        style={{
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%, -50%) scale(${clicking ? 0.6 : 1})`,
          transition: 'transform 0.15s ease-out',
        }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-katana-crimson" />
      </div>
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: pos.x,
          top: pos.y,
          transform: 'translate(-50%, -50%)',
          transition: 'left 0.05s, top 0.05s',
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-katana-crimson" />
      </div>
    </>
  );
}
