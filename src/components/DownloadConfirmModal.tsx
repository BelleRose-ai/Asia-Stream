import React, { useEffect, useState } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { DownloadSource } from '../types';

export interface PendingDownload {
  source: DownloadSource;
  itemTitle?: string;
  serverName: string;
}

interface DownloadConfirmModalProps {
  pendingDownload: PendingDownload | null;
  onClose: () => void;
}

export function parseServerName(url: string, sourceName?: string): string {
  if (sourceName) {
    if (/clicknupload/i.test(sourceName)) return 'Clicknupload';
    if (/pixeldrain/i.test(sourceName)) return 'Pixeldrain';
    if (/buzzheavier/i.test(sourceName)) return 'Buzzheavier';
    if (/mi+xdrop/i.test(sourceName)) return 'Mixdrop';
    if (/mega/i.test(sourceName)) return 'MEGA';
    if (/google\s*drive/i.test(sourceName)) return 'Google Drive';
    if (/mediafire/i.test(sourceName)) return 'MediaFire';
    if (/1fichier/i.test(sourceName)) return '1Fichier';
    if (/kwik/i.test(sourceName)) return 'Kwik';
    if (/loadedfiles/i.test(sourceName)) return 'LoadedFiles';
  }

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    if (host.includes('clicknupload')) return 'Clicknupload';
    if (host.includes('pixeldrain')) return 'Pixeldrain';
    if (host.includes('buzzheavier')) return 'Buzzheavier';
    if (host.includes('mixdrop') || host.includes('miiixdrop')) return 'Mixdrop';
    if (host.includes('mega.nz') || host.includes('mega.io')) return 'MEGA';
    if (host.includes('drive.google')) return 'Google Drive';
    if (host.includes('mediafire')) return 'MediaFire';
    if (host.includes('1fichier')) return '1Fichier';
    if (host.includes('kwik')) return 'Kwik';
    if (host.includes('loadedfiles')) return 'LoadedFiles';

    const parts = host.split('.');
    if (parts.length >= 2) {
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    return host;
  } catch {
    return 'Secure File Server';
  }
}

export const DownloadConfirmModal: React.FC<DownloadConfirmModalProps> = ({
  pendingDownload,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    let timer: any;
    if (pendingDownload) {
      setCountdown(5);
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            const targetUrl = pendingDownload.source.url;
            const unlockedKey = 'download_unlocked_' + btoa(targetUrl);
            sessionStorage.setItem(unlockedKey, 'true');
            onClose();
            window.location.href = 'https://bigotcomet.com/wpkxj35nq9?key=43a936cdcf000461a4c773cb5b5b608c';
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [pendingDownload, onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (pendingDownload) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingDownload, onClose]);

  if (!pendingDownload) return null;

  const { source, serverName } = pendingDownload;
  const targetUrl = source.url;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#121216] border border-[#2d2f39] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
        data-target-url={targetUrl}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-400 hover:text-white border border-[#2d2f39] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center gap-4 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              Preparing Secure Link
            </span>
            <h2 id="download-modal-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              Redirecting to Download...
            </h2>
          </div>
        </div>

        {/* Countdown View */}
        <div className="space-y-6 text-center py-2">
          <div className="flex flex-col items-center justify-center space-y-3">
            {/* Circular Progress Timer */}
            <div className="relative w-24 h-24 flex items-center justify-center bg-[#181922] border-4 border-emerald-500/30 rounded-full shadow-inner shadow-emerald-500/20">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-pulse"></div>
              <span className="text-3xl font-black text-emerald-400">{countdown}s</span>
            </div>
            <p className="text-sm font-medium text-gray-300">
              Please wait while you are redirected to <span className="text-white font-bold">{serverName}</span>...
            </p>
          </div>

          <div className="text-xs text-gray-400">
            Your download will start automatically in a moment. Do not close this window.
          </div>
        </div>
      </div>
    </div>
  );
};
