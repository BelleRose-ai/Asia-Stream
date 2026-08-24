import React, { useState } from 'react';
import { X, Key, Check, Info } from 'lucide-react';

interface SettingsModalProps {
  currentApiKey: string;
  onSaveApiKey: (key: string) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ currentApiKey, onSaveApiKey, onClose }) => {
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(apiKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 700);
  };

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
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">TMDB API Configuration</h3>
            <p className="text-xs text-gray-400">Fetch live high-res posters & metadata</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300">TMDB API Key (v3 auth)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your TMDB API Key..."
              className="w-full px-3.5 py-2.5 bg-[#1a1b23] border border-[#2d2f39] rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="p-3 bg-[#1a1b23]/50 border border-[#2d2f39] rounded-xl text-xs text-gray-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p>
              The app works fully out-of-the-box using curated fallback metadata. Providing your TMDB API key is completely optional.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Saved Successfully!</span>
              </>
            ) : (
              <span>Save API Key</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
