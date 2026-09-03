import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  type: '300x250' | '728x90' | 'native';
  className?: string;
  desktopOnly?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '', desktopOnly = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous content if any
    container.innerHTML = '';

    if (type === 'native') {
      const div = document.createElement('div');
      div.id = 'container-0a6e7c853cf7cadc77355879408278bf';
      container.appendChild(div);

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31151261.profitableratecpmnetwork.com/0a6e7c853cf7cadc77355879408278bf/invoke.js';
      container.appendChild(script);
    } else if (type === '300x250') {
      const scriptOptions = document.createElement('script');
      scriptOptions.innerHTML = `
        atOptions = {
          'key' : '543ef6d342ff74a9f327ef45894dd199',
          'format' : 'iframe',
          'height' : 250,
          'width' : 300,
          'params' : {}
        };
      `;
      container.appendChild(scriptOptions);

      const scriptInvoke = document.createElement('script');
      scriptInvoke.src = 'https://www.highrevenueformat.com/543ef6d342ff74a9f327ef45894dd199/invoke.js';
      container.appendChild(scriptInvoke);
    } else if (type === '728x90') {
      const scriptOptions = document.createElement('script');
      scriptOptions.innerHTML = `
        atOptions = {
          'key' : '41537a0f3a0bc47014ec37f8606e807c',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      container.appendChild(scriptOptions);

      const scriptInvoke = document.createElement('script');
      scriptInvoke.src = 'https://www.highrevenueformat.com/41537a0f3a0bc47014ec37f8606e807c/invoke.js';
      container.appendChild(scriptInvoke);
    }
  }, [type]);

  if (desktopOnly) {
    return (
      <div className={`hidden md:flex justify-center items-center my-4 overflow-hidden ${className}`}>
        <div ref={containerRef} className="flex justify-center items-center min-h-[90px]" />
      </div>
    );
  }

  return (
    <div className={`flex justify-center items-center my-4 overflow-hidden ${className}`}>
      <div ref={containerRef} className="flex justify-center items-center" />
    </div>
  );
};
