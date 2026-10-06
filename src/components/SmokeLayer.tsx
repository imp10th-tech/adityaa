import { useEffect, useRef, useState } from 'react';

interface SmokeLayerProps {
  className?: string;
}

export function SmokeLayer({ className = '' }: SmokeLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !layerRef.current) return;

    let raf = 0;
    let offset = 0;

    const animate = () => {
      offset += 0.3;
      if (layerRef.current) {
        const blobs = layerRef.current.querySelectorAll<HTMLDivElement>('[data-smoke]');
        blobs.forEach((blob, i) => {
          const x = Math.sin(offset * 0.01 + i * 2) * 40;
          const y = Math.cos(offset * 0.008 + i * 1.5) * 30;
          blob.style.transform = `translate(${x}px, ${y}px)`;
        });
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={layerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div
        data-smoke
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-katana-crimson/10 blur-3xl"
      />
      <div
        data-smoke
        className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-katana-blood/10 blur-3xl"
      />
      <div
        data-smoke
        className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full bg-katana-crimson/8 blur-3xl"
      />
    </div>
  );
}
