import React from 'react';
import { X, Send, CheckCircle, ExternalLink } from 'lucide-react';

interface TelegramModalProps {
  onClose: () => void;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({ onClose }) => {
  const handleJoinTelegram = () => {
    window.open('https://t.me/example_asian_dramas', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121212] border border-[#2d2f39] rounded-2xl shadow-2xl p-6 text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-[#0088cc]/20 border border-[#0088cc]/40 mx-auto flex items-center justify-center text-cyan-400 shadow-xl shadow-cyan-500/10">
          <Send className="w-8 h-8 text-cyan-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">Join Our Telegram Channel</h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            Get instant notifications when new K-Drama, C-Drama, and Anime episodes are uploaded in 1080p HD. Request missing episodes or report broken links directly!
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleJoinTelegram}
            className="w-full py-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold text-sm shadow-lg shadow-[#0088cc]/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>Open Telegram Channel</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-300 font-medium text-xs transition-all"
          >
            Close & Continue Browsing
          </button>
        </div>

        <div className="pt-2 text-[11px] text-gray-500">
          Official channel: @AsianDramaPortal_Updates
        </div>
      </div>
    </div>
  );
};
