import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle, 
  FileText, 
  BookMarked, 
  BookOpen, 
  Printer,
  Play,
  RotateCw,
  ShieldCheck,
  Share2
} from 'lucide-react';
import { Resource } from '../types';
import { extractYouTubeId, getYouTubeWatchUrl, getYouTubeEmbedUrl } from '../utils/youtube';

interface ResourceViewerModalProps {
  resource: Resource | null;
  onClose: () => void;
  onSaveToNotebook?: (title: string, subject: string, content: string) => void;
}

export const ResourceViewerModal: React.FC<ResourceViewerModalProps> = ({
  resource,
  onClose,
  onSaveToNotebook
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [savedToNotebook, setSavedToNotebook] = useState<boolean>(false);
  const [useNoCookieDomain, setUseNoCookieDomain] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(0);

  if (!resource) return null;

  // Resolve YouTube ID and watch URL
  const youtubeId = resource.youtubeId || (resource.externalUrl ? extractYouTubeId(resource.externalUrl) : null);
  const isVideo = resource.category === 'video' && !!youtubeId;
  const isNotes = resource.category === 'notes';
  const watchUrl = getYouTubeWatchUrl(youtubeId || undefined, resource.externalUrl);

  const handleCopyMarkdown = () => {
    if (!resource.contentMarkdown && !resource.description) return;
    navigator.clipboard.writeText(resource.contentMarkdown || resource.description);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCopyVideoLink = () => {
    if (!watchUrl) return;
    navigator.clipboard.writeText(watchUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const text = resource.contentMarkdown || resource.description;
    if (!text) return;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveToNotebookClick = () => {
    if (!onSaveToNotebook) return;
    const content = resource.contentMarkdown || resource.description;
    onSaveToNotebook(resource.title, resource.topic, content);
    setSavedToNotebook(true);
    setTimeout(() => setSavedToNotebook(false), 2000);
  };

  const handleReloadIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleDomain = () => {
    setUseNoCookieDomain((prev) => !prev);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/80 dark:bg-zinc-950/80">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mb-1">
              <span className={`font-bold uppercase tracking-wider ${
                isVideo
                  ? 'text-red-600 dark:text-red-400'
                  : isNotes
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-indigo-600 dark:text-indigo-400'
              }`}>
                {isVideo ? 'YouTube Video Lecture' : isNotes ? 'NCERT Chapter Notes' : resource.category}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate max-w-[180px] font-medium">{resource.topic}</span>
              {resource.duration && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{resource.duration}</span>
                </>
              )}
              {resource.readingTime && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{resource.readingTime}</span>
                </>
              )}
            </div>
            <h2 className="text-sm sm:text-lg font-bold text-zinc-900 dark:text-white truncate">
              {resource.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {watchUrl && (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors border border-red-200/60 dark:border-red-800/40"
                title="Watch on official YouTube site"
              >
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {isVideo && youtubeId ? (
            <div className="space-y-4">
              {/* Responsive 16:9 Video Frame */}
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-lg border border-zinc-800">
                <iframe
                  key={`${youtubeId}-${iframeKey}-${useNoCookieDomain}`}
                  src={getYouTubeEmbedUrl(youtubeId, { autoplay: false, noCookie: useNoCookieDomain })}
                  title={resource.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="w-full h-full border-0"
                />
              </div>

              {/* Action Bar for Video Lecture */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Directly on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                  </a>

                  <button
                    onClick={handleCopyVideoLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-medium text-xs text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                    title="Copy direct YouTube URL"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleReloadIframe}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-medium text-xs text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                    title="Reload player frame"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span className="hidden sm:inline">Reload Player</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={handleToggleDomain}
                    className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:underline flex items-center gap-1"
                    title="Switch embed domain if blocked"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{useNoCookieDomain ? 'Using Privacy Domain' : 'Standard Embed'}</span>
                  </button>
                </div>
              </div>

              {/* Informational Callout for Browser Embed Blockers */}
              <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/30 text-amber-900 dark:text-amber-200 text-xs flex items-start justify-between gap-3">
                <div className="leading-relaxed">
                  <span className="font-bold">Playback tip:</span> If playback says <em>"Video unavailable"</em> or is blocked by your browser extensions/cookies, click{' '}
                  <a
                    href={watchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-bold text-amber-900 dark:text-amber-100 hover:text-red-600"
                  >
                    Watch Directly on YouTube
                  </a>{' '}
                  to view the verified lecture in full 1080p with speed controls.
                </div>
                <a
                  href={watchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 px-2.5 py-1 rounded bg-amber-200/80 dark:bg-amber-800/50 hover:bg-amber-300 dark:hover:bg-amber-800 text-[11px] font-semibold transition-colors"
                >
                  Open ↗
                </a>
              </div>

              {/* Video metadata row */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">
                    {resource.channelOrAuthor}
                  </span>
                  {resource.isVerified && (
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                  )}
                  {resource.isCustom && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                      User Added
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-zinc-400" />
                    {resource.viewCountText}
                  </span>
                  {resource.duration && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {resource.duration}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <h4 className="font-bold text-zinc-900 dark:text-white mb-1.5 text-xs uppercase tracking-wider">
                  Lecture Details & Syllabus Focus
                </h4>
                {resource.description}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Cheat Sheet / Notes Action Sub-bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                  <span>Interactive NCERT Chapter Revision Sheet</span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  {onSaveToNotebook && (
                    <button
                      onClick={handleSaveToNotebookClick}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors shadow-xs"
                      title="Add note to your personal notebook"
                    >
                      {savedToNotebook ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Saved to Notebook!</span>
                        </>
                      ) : (
                        <>
                          <BookMarked className="w-3.5 h-3.5" />
                          <span>Save to My Notebook</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={handleCopyMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 font-medium text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold transition-colors shadow-xs"
                    title="Print clean study sheet or save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>

              {/* Rendered content */}
              <div className="p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 text-xs sm:text-sm space-y-4 text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans">
                <pre className="whitespace-pre-wrap font-sans leading-relaxed text-xs sm:text-sm">
                  {resource.contentMarkdown || resource.description}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
