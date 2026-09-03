import React, { useEffect, useRef } from 'react';

export const NativeBanner: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container.hasChildNodes()) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = 'https://pl31151261.profitableratecpmnetwork.com/0a6e7c853cf7cadc77355879408278bf/invoke.js';
    container.appendChild(script);
  }, []);

  return (
    <div className={`my-4 flex justify-center items-center ${className}`}>
      <div id="container-0a6e7c853cf7cadc77355879408278bf" ref={containerRef} />
    </div>
  );
};
