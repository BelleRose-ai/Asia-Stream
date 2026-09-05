import React, { useEffect, useState } from 'react';
import { ShieldCheck, ExternalLink, X, CheckCircle2, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { DownloadSource } from '../types';
import { AdBanner } from './AdBanner';

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
  onClose
}) => {
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Reset state when modal opens/closes
    if (!pendingDownload) {
      setIsCountingDown(false);
      setCountdown(5);
    }
  }, [pendingDownload]);

  useEffect(() => {
    let timer: any;
    if (isCountingDown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isCountingDown && countdown === 0 && pendingDownload) {
      // Open the target URL and close modal
      window.open(pendingDownload.source.url, '_blank', 'noopener,noreferrer');
      onClose();
    }
    return () => clearTimeout(timer);
  }, [isCountingDown, countdown, pendingDownload, onClose]);

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

  const { source, itemTitle, serverName } = pendingDownload;

  const handleProceed = () => {
    // Dynamically inject the popunder script only when the user clicks proceed
    const script = document.createElement('script');
    script.src = 'https://pl31165316.profitableratecpmnetwork.com/55/1c/7a/551c7ae7f11ccc4489fe66d5ffd0be3d.js';
    script.async = true;
    document.head.appendChild(script);

    setIsCountingDown(true);
  };

  const isClicknupload = /clicknupload/i.test(serverName) || /clicknupload/i.test(source.name);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={!isCountingDown ? onClose : undefined}
    >
      <div 
        className="relative w-full max-w-lg bg-[#121216] border border-[#2d2f39] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-left"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
      >
        {/* Close Button */}
        {!isCountingDown && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-400 hover:text-white border border-[#2d2f39] transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header with Icon */}
        <div className="flex items-start gap-4 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
              {isCountingDown ? 'Preparing Secure Link' : 'Verified File Gateway'}
            </span>
            <h2 id="download-modal-title" className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
              {isCountingDown ? 'Redirecting to Download...' : 'Heads Up Before You Download!'}
            </h2>
          </div>
        </div>

        {isCountingDown ? (
          /* Countdown View with Banner Ad */
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

            {/* Embedded Ad Banner in Countdown Screen */}
            <div className="p-3 rounded-2xl bg-[#181922] border border-[#2d2f39] flex flex-col items-center justify-center">
              <AdBanner type="300x250" />
            </div>

            <div className="text-xs text-gray-400">
              Your download will start automatically in a moment. Do not close this window.
            </div>
          </div>
        ) : (
          /* Initial Warning View */
          <>
            {/* Target Server Callout */}
            <div className="p-4 rounded-2xl bg-[#181922] border border-[#2d2f39] space-y-2">
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                You are being directed to our secure file server:{' '}
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-violet-600/30 border border-violet-500/40 text-violet-300 font-bold">
                  {serverName}
                </span>
              </p>
              {itemTitle && (
                <p className="text-xs text-gray-400 truncate">
                  Target: <span className="text-gray-200 font-medium">{itemTitle}</span>
                  {source.quality && ` • ${source.quality}`}
                  {source.size && ` • ${source.size}`}
                </p>
              )}
            </div>

            {/* Warning Checklist */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Make sure the page you land on matches the server name.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>If an unrelated popup tab opens, close it and return here.</span>
              </div>
              <div className="flex items-start gap-3 text-xs sm:text-sm text-gray-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Your file is clean, verified, and ready.</span>
              </div>
            </div>

            {/* Slow Download Hint for Clicknupload */}
            {isClicknupload && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                <span className="font-bold">Tip:</span>
                <span>Remember to select the <strong>SLOW DOWNLOAD OPTION</strong> on Clicknupload for free direct access.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#1a1b23] hover:bg-[#252836] text-gray-300 hover:text-white font-semibold text-xs sm:text-sm border border-[#2d2f39] transition-all cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                style={{ minHeight: '48px', touchAction: 'manipulation' }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
              >
                <span>I Understand — Proceed to File</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

