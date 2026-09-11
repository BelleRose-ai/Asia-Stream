import React, { useEffect } from 'react';
import { X, Shield, Send } from 'lucide-react';

interface PrivacyModalProps {
  onClose: () => void;
  onOpenTelegram: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose, onOpenTelegram }) => {
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
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 border-b border-[#2d2f39] pb-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Privacy Policy for AsiaStream</h3>
            <p className="text-xs text-gray-400">Last Updated: September 11, 2026</p>
          </div>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <p className="text-gray-300">
            Welcome to AsiaStream. We are committed to protecting your privacy and ensuring you understand exactly how your information is handled when you use our Android application and website.
          </p>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">Information We Collect</h4>
            <p>
              AsiaStream is designed to be as privacy-focused as possible. We do not require users to create an account, nor do we collect sensitive personal data such as your name, email address, or phone number.
            </p>
            <p className="pl-3 border-l-2 border-cyan-500/40 text-gray-300">
              <strong className="text-white">Local Data:</strong> Any data regarding your watch history, bookmarks, or downloaded episodes is stored locally on your device using your phone's internal storage. We do not sync this data to our servers.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">Third-Party Services & Data Sharing</h4>
            <p>
              To provide our services, AsiaStream relies on several third-party platforms. These providers may collect technical device information (such as your IP address or mobile device IDs) to function properly:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
              <li><strong className="text-white">The Movie Database (TMDB):</strong> We use the TMDB API to display movie and series metadata, posters, and synopses.</li>
              <li><strong className="text-white">Firebase / Firestore:</strong> Used for our backend infrastructure to dynamically serve our catalog of movies and series categories.</li>
              <li><strong className="text-white">Adsterra:</strong> We use Adsterra to display advertisements. Adsterra may use cookies or device identifiers to serve targeted advertisements based on your browsing behavior.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">External Links</h4>
            <p>
              AsiaStream acts as a directory and contains links to external video hosting platforms (e.g., Buzzheavier, LoadedFiles, Clicknupload). We do not control these third-party websites and are not responsible for their privacy practices or content.
            </p>
          </div>

          <div className="space-y-2 bg-[#1a1b23] p-4 rounded-xl border border-[#2d2f39]">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">Contact Us</h4>
            <p className="text-xs">
              If you have any questions or concerns regarding this Privacy Policy, please reach out to us at: <a href="mailto:asia-stream@tutamail.com" className="text-cyan-400 underline hover:text-cyan-300">asia-stream@tutamail.com</a>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#2d2f39] flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => {
              onClose();
              onOpenTelegram();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0088cc] hover:bg-[#0077b5] text-white font-semibold text-xs shadow-lg shadow-[#0088cc]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Contact Support via Telegram</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-300 font-medium text-xs transition-all cursor-pointer"
          >
            Close Policy
          </button>
        </div>
      </div>
    </div>
  );
};
