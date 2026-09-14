import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  type: '300x250' | '728x90' | 'native';
  className?: string;
  desktopOnly?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '', desktopOnly = false }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current) return;
    adRef.current.innerHTML = '';

    if (type === '728x90') {
      (window as any).atOptions = {
        'key' : 'a9eda7604b8bede1a06454fe17fe7e28',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://bigotcomet.com/a9eda7604b8bede1a06454fe17fe7e28/invoke.js';
      adRef.current.appendChild(script);
    } else if (type === 'native') {
      const container = document.createElement('div');
      container.id = 'container-660007fc30364a8ccb419a40a19bf6a7';
      adRef.current.appendChild(container);

      const script = document.createElement('script');
      script.async = true;
      script.dataset.cfasync = 'false';
      script.src = 'https://bigotcomet.com/660007fc30364a8ccb419a40a19bf6a7/invoke.js';
      adRef.current.appendChild(script);
    } else {
      // 300x250
      (window as any).atOptions = {
        'key' : 'f6956208cadaf0e605d6e0478707f118',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://bigotcomet.com/f6956208cadaf0e605d6e0478707f118/invoke.js';
      adRef.current.appendChild(script);
    }
  }, [type]);

  return (
    <div className={`flex flex-col items-center justify-center my-4 overflow-hidden ${desktopOnly ? 'hidden md:flex' : ''} ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Advertisement</span>
      <div ref={adRef} className="flex items-center justify-center min-w-[300px] min-h-[90px]" />
    </div>
  );
};
