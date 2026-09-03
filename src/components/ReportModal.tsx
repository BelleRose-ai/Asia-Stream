import React, { useState } from 'react';
import { Flag, X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  dramaTitle: string;
  defaultEpisode?: string | number;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  dramaTitle,
  defaultEpisode = '1'
}) => {
  const [episode, setEpisode] = useState<string>(String(defaultEpisode));
  const [issueType, setIssueType] = useState<string>('Broken Download Link');
  const [details, setDetails] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      const mailtoUrl = `mailto:michelleehomazino@gmail.com?subject=${encodeURIComponent(
        `Broken Link Report: ${dramaTitle} Ep ${episode}`
      )}&body=${encodeURIComponent(
        `Drama: ${dramaTitle}\nEpisode: ${episode}\nIssue Type: ${issueType}\nDetails: ${details || 'None'}`
      )}`;

      const a = document.createElement('a');
      a.href = mailtoUrl;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      // Ignore popup blocking errors
    }

    setTimeout(() => {
      setIsSubmitted(false);
      setDetails('');
      onClose();
    }, 2500);
  };

  // Google Form prefill URL or direct report action
  const googleFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSc.../viewform?usp=pp_url&entry.123456=${encodeURIComponent(
    dramaTitle
  )}&entry.789012=${encodeURIComponent(episode)}`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#121216] border border-[#2d2f39] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-left"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-[#1a1b23] hover:bg-[#2d2f39] text-gray-400 hover:text-white border border-[#2d2f39] transition-all cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
              Support & Maintenance
            </span>
            <h3 id="report-modal-title" className="text-lg font-extrabold text-white tracking-tight">
              Report Broken / Dead Link
            </h3>
          </div>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-white font-bold text-base">Report Submitted Successfully!</h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto">
              Thank you for keeping our library pristine. Our team will verify and fix this link shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#181922] border border-[#2d2f39] space-y-1">
              <p className="text-xs text-gray-400">Target Title</p>
              <p className="text-sm font-bold text-white truncate">{dramaTitle}</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Which episode is broken?
              </label>
              <input
                type="text"
                value={episode}
                onChange={(e) => setEpisode(e.target.value)}
                required
                placeholder="e.g. Episode 5 or Feature Film"
                className="w-full px-4 py-2.5 rounded-xl bg-[#181922] border border-[#2d2f39] text-white text-sm focus:outline-none focus:border-amber-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#181922] border border-[#2d2f39] text-white text-sm focus:outline-none focus:border-amber-500 transition-all cursor-pointer"
              >
                <option value="Broken Download Link">Link is broken / 404 Error</option>
                <option value="Wrong Episode Video">Wrong Episode / Mismatched Video</option>
                <option value="Audio / Subtitle Issue">Audio / Subtitle Issue</option>
                <option value="Slow / Buffering Server">Server extremely slow</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="Describe any error messages encountered..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#181922] border border-[#2d2f39] text-white text-xs focus:outline-none focus:border-amber-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cyan-400 hover:text-cyan-300 underline underline-offset-2 font-medium"
              >
                Open Google Form
              </a>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-[#1a1b23] hover:bg-[#252836] text-gray-300 font-semibold text-xs border border-[#2d2f39] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-amber-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Report</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
