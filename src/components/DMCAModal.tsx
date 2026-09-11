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
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3.5 border-b border-[#2d2f39] pb-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">DMCA Notice & Copyright Disclaimer</h3>
            <p className="text-xs text-gray-400">Digital Millennium Copyright Act Safe Harbor Policy</p>
          </div>
        </div>

        <div className="space-y-5 text-xs sm:text-sm text-gray-300 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">Disclaimer of Hosting</h4>
            <p>
              AsiaStream is a completely automated indexing platform. We do not host, upload, or store any video files, media, or copyright-protected material on our servers.
            </p>
            <p>
              The AsiaStream app and website act strictly as a directory and search engine, scraping and linking to content that is already publicly available on the internet, hosted by third-party file-sharing services (such as Buzzheavier, LoadedFiles, Pixeldrain, etc.).
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">Digital Millennium Copyright Act (DMCA) Policy</h4>
            <p>
              AsiaStream respects the intellectual property rights of others. Because we do not host the files ourselves, we cannot delete videos from the internet. If you find copyright-infringing content, you must contact the external host (the site where the video is actually stored) to request a takedown. Once the file is removed from the host server, it will automatically break the link and become inaccessible on AsiaStream.
            </p>
            <p>
              However, we are happy to assist copyright owners by removing the links to infringing content from our app's directory.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider text-cyan-400">How to Request a Link Removal</h4>
            <p>
              If you are the copyright owner (or an authorized agent) and wish to have a link removed from our directory, please send a formal DMCA takedown notice containing the following information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-300">
              <li>A physical or electronic signature of the copyright owner or authorized representative.</li>
              <li>A clear description of the copyrighted work claimed to have been infringed.</li>
              <li>The exact URL(s) or location within the AsiaStream app where the link is found.</li>
              <li>Your contact information, including your name, address, telephone number, and email.</li>
              <li>A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner.</li>
              <li>A statement made under penalty of perjury that the information provided is accurate.</li>
            </ul>
          </div>

          <div className="space-y-2 bg-[#1a1b23] p-4 rounded-xl border border-[#2d2f39]">
            <p className="text-xs">
              Please email your link removal requests to: <a href="mailto:asia-stream@tutamail.com" className="text-cyan-400 underline hover:text-cyan-300">asia-stream@tutamail.com</a>
            </p>
            <p className="text-xs text-gray-400 pt-1">
              Please allow 3–5 business days for us to process your request and remove the specific links from our database.
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
