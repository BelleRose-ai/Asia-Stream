import React from 'react';
import { X, Key, ShieldCheck, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#121212] border border-[#2d2f39] rounded-2xl shadow-2xl p-6 space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-400 hover:text-white transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">TMDB API & Server Security</h3>
            <p className="text-xs text-gray-400">Secure server-side environment configuration</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-gray-300 leading-relaxed">
          <p>
            To keep your TMDB API key completely secure and hidden from public visitors, this application uses a <strong>secure backend proxy (`/api/tmdb/*`)</strong>.
          </p>

          <div className="p-3.5 bg-[#1a1b23] border border-[#2d2f39] rounded-xl space-y-2">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              How to configure on Vercel:
            </h4>
            <ol className="list-decimal pl-4 space-y-1 text-gray-400">
              <li>Go to your Vercel Project Dashboard.</li>
              <li>Navigate to <strong>Settings → Environment Variables</strong>.</li>
              <li>Add a new variable named <code className="text-cyan-300 bg-black/40 px-1 py-0.5 rounded">TMDB_API_KEY</code>.</li>
              <li>Paste your TMDB v3 API Key or Bearer Token as the value.</li>
              <li>Redeploy your project!</li>
            </ol>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg transition-all"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
