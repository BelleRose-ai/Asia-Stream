import React, { useEffect } from 'react';
import { X, ShieldAlert, Send } from 'lucide-react';

interface DMCAModalProps {
  onClose: () => void;
  onOpenTelegram: () => void;
}

export const DMCAModal: React.FC<DMCAModalProps> = ({ onClose, onOpenTelegram }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#121212] border border-[#2d2f39] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 border-b border-[#2d2f39] pb-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">DMCA & Content Disclaimer</h3>
            <p className="text-xs text-gray-400">Digital Millennium Copyright Act Safe Harbor Policy</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">1. Non-Hosting Provider</h4>
            <p>
              AsiaStream operates strictly as an automated indexing directory and search engine. We do not upload, host, transmit, control, or store any digital media files, video streams, or torrents on our servers. All streams, media files, and download links are hosted independently on external, non-affiliated third-party storage services across the internet.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">2. Content Removal & Safe Harbor</h4>
            <p>
              We respect the intellectual property rights of others. If you are a copyright owner or an authorized agent thereof and believe that any content indexed by our directory infringes upon your copyrights, you may request the removal of the corresponding index links by contacting our designated compliance team. Valid takedown notices will be reviewed and processed, and corresponding index links will be removed within 24 to 48 hours.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">3. Takedown Notice Submissions</h4>
            <p>
              Copyright infringement notices must include sufficient details identifying the copyrighted work and the exact page URL or index reference on our platform. Please direct all takedown notices or compliance inquiries to our official Telegram channel support.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#2d2f39] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              onClose();
              onOpenTelegram();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold text-xs shadow-lg shadow-[#0088cc]/20 flex items-center justify-center gap-2 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Support via Telegram</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-300 font-medium text-xs transition-all"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};
