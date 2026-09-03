import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  type: 'native' | '300x250' | '728x90';
  className?: string;
  desktopOnly?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '', desktopOnly = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    if (type === 'native') {
      // Native banner requires the specific container ID div
      const innerDiv = document.createElement('div');
      innerDiv.id = 'container-0a6e7c853cf7cadc77355879408278bf';
      container.appendChild(innerDiv);

      const script = document.createElement('script');
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl31151261.profitableratecpmnetwork.com/0a6e7c853cf7cadc77355879408278bf/invoke.js';
      container.appendChild(script);
    } else {
      const key = type === '300x250' ? '543ef6d342ff74a9f327ef45894dd199' : '41537a0f3a0bc47014ec37f8606e807c';
      const height = type === '300x250' ? 250 : 90;
      const width = type === '300x250' ? 300 : 728;

      // Set global atOptions required by HighRevenueFormat/Adsterra
      (window as any).atOptions = {
        'key': key,
        'format': 'iframe',
        'height': height,
        'width': width,
        'params': {}
      };

      const scriptInvoke = document.createElement('script');
      scriptInvoke.type = 'text/javascript';
      scriptInvoke.src = `https://www.highrevenueformat.com/${key}/invoke.js`;
      container.appendChild(scriptInvoke);
    }
  }, [type]);

  if (desktopOnly) {
    return (
      <div className={`hidden md:flex justify-center items-center my-4 ${className}`}>
        <div 
          ref={containerRef} 
          className="flex justify-center items-center bg-[#14151a] border border-[#2d2f39] rounded-xl shadow-lg p-2 min-h-[100px]"
          style={{ minWidth: type === '728x90' ? '728px' : '300px' }}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center my-4 ${className}`}>
      <div 
        ref={containerRef} 
        className="flex justify-center items-center max-w-full overflow-x-auto bg-[#14151a] border border-[#2d2f39] rounded-xl shadow-lg p-2"
        style={{ minHeight: type === '300x250' ? '260px' : type === '728x90' ? '100px' : 'auto' }}
      />
    </div>
  );
};
