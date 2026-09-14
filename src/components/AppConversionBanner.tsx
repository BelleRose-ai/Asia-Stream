import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';

export const AppConversionBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [downloading, setDownloading] = useState<boolean>(false);

  if (!isVisible) return null;

  const handleDownloadApk = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.location.href = "https://www.mediafire.com/file/2dh6hs1s98l2glu/AsiaStream-v1.10-build11+%283%29.apk/file";
    }, 800);
  };

  return (
    <div className="sticky top-0 z-40 bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border-b border-cyan-500/30 px-4 py-3 shadow-lg shadow-cyan-950/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 flex-shrink-0 animate-pulse">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm sm:text-base font-semibold text-white tracking-wide">
              ⚡ Faster downloads & offline play with the AsiaStream App!
            </p>
            <p className="text-xs text-cyan-200/70 hidden sm:block">
              Experience zero ads, push notifications for new episodes, and native MKV streaming.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDownloadApk}
            disabled={downloading}
            style={{
              padding: '8px 20px',
              borderRadius: '8px',
              backgroundColor: '#06B6D4',
              color: '#030712'
            }}
            className="text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Preparing APK...' : 'Download APK'}</span>
          </button>

          <button
            onClick={() => setIsVisible(false)}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
