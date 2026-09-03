import React from 'react';

interface AdBannerProps {
  type: '300x250' | '728x90' | 'native';
  className?: string;
  desktopOnly?: boolean;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '', desktopOnly = false }) => {
  const getDimensionsAndSrc = () => {
    if (type === '728x90') {
      return {
        width: 728,
        height: 90,
        content: `
          <!DOCTYPE html>
          <html>
            <head><style>body{margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head>
            <body>
              <script type="text/javascript">
                atOptions = {
                  'key' : '44b2dfe87e78fa2356599b52110a1acd',
                  'format' : 'iframe',
                  'height' : 90,
                  'width' : 728,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://www.highrevenueformat.com/44b2dfe87e78fa2356599b52110a1acd/invoke.js"></script>
            </body>
          </html>
        `
      };
    }

    if (type === 'native') {
      return {
        width: '100%',
        height: 160,
        content: `
          <!DOCTYPE html>
          <html>
            <head><style>body{margin:0;padding:0;overflow:hidden;background:transparent;}</style></head>
            <body>
              <div id="container-146d2eb5fb57f9a5718eb061c2e3167a"></div>
              <script async="async" data-cfasync="false" src="https://pl31165318.profitableratecpmnetwork.com/146d2eb5fb57f9a5718eb061c2e3167a/invoke.js"></script>
            </body>
          </html>
        `
      };
    }

    // Default: 300x250
    return {
      width: 300,
      height: 250,
      content: `
        <!DOCTYPE html>
        <html>
          <head><style>body{margin:0;padding:0;overflow:hidden;display:flex;justify-content:center;align-items:center;background:transparent;}</style></head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key' : 'b5ef17910198d5dc1562f677374f7c1b',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script type="text/javascript" src="https://www.highrevenueformat.com/b5ef17910198d5dc1562f677374f7c1b/invoke.js"></script>
          </body>
        </html>
      `
    };
  };

  const { width, height, content } = getDimensionsAndSrc();

  return (
    <div className={`flex flex-col items-center justify-center my-4 overflow-hidden ${desktopOnly ? 'hidden md:flex' : ''} ${className}`}>
      <span className="text-[10px] uppercase tracking-wider text-gray-500 mb-1">Advertisement</span>
      <iframe
        title={`ad-${type}`}
        srcDoc={content}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  );
};
