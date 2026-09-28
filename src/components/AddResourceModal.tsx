import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Youtube, 
  Play, 
  Sparkles, 
  Check, 
  AlertCircle,
  GraduationCap,
  BookOpen,
  Globe,
  Clock,
  User,
  Tag,
  FileText
} from 'lucide-react';
import { Resource, AcademicLevel, FieldOfStudy, LearningLanguage } from '../types';
import { ACADEMIC_LEVELS, SUBJECT_OPTIONS, LANGUAGES } from '../data/mockResources';
import { extractYouTubeId, getYouTubeThumbnail } from '../utils/youtube';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResource: (newResource: Resource) => void;
  defaultAcademicLevel: AcademicLevel;
  defaultFieldOfStudy: FieldOfStudy;
  defaultLanguage: LearningLanguage;
}

const POPULAR_EDUCATORS = [
  'Physics Wallah - Alakh Pandey',
  'Dear Sir',
  'Magnet Brains',
  'Khan Academy India',
  'Unacademy NEET/JEE',
  'Apna College',
  'Mohit Tyagi',
  'Sunil Panda - Commerce',
  'Exphub - Prashant Kirad',
  'Vedantu',
  '3Blue1Brown'
];

export const AddResourceModal: React.FC<AddResourceModalProps> = ({
  isOpen,
  onClose,
  onAddResource,
  defaultAcademicLevel,
  defaultFieldOfStudy,
  defaultLanguage
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [extractedId, setExtractedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [channelOrAuthor, setChannelOrAuthor] = useState('');
  const [academicLevel, setAcademicLevel] = useState<AcademicLevel>(defaultAcademicLevel);
  const [fieldOfStudy, setFieldOfStudy] = useState<FieldOfStudy>(defaultFieldOfStudy);
  const [language, setLanguage] = useState<LearningLanguage>(defaultLanguage);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('45:00');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-detect YouTube ID whenever URL changes
  useEffect(() => {
    if (youtubeUrl.trim()) {
      const id = extractYouTubeId(youtubeUrl.trim());
      setExtractedId(id);
      if (!id && youtubeUrl.length > 8) {
        setErrorMsg('Could not detect a valid YouTube video ID. Check the URL format.');
      } else {
        setErrorMsg('');
      }
    } else {
      setExtractedId(null);
      setErrorMsg('');
    }
  }, [youtubeUrl]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Please enter a lecture title.');
      return;
    }
    if (!channelOrAuthor.trim()) {
      setErrorMsg('Please specify the teacher or channel name.');
      return;
    }
    if (!topic.trim()) {
      setErrorMsg('Please enter the topic or chapter name.');
      return;
    }

    const finalYoutubeId = extractedId || extractYouTubeId(youtubeUrl) || undefined;
    const finalExternalUrl = finalYoutubeId
      ? `https://www.youtube.com/watch?v=${finalYoutubeId}`
      : youtubeUrl.trim() || undefined;

    const newRes: Resource = {
      id: `custom-yt-${Date.now()}`,
      title: title.trim(),
      channelOrAuthor: channelOrAuthor.trim(),
      isVerified: true,
      viewCount: 100000,
      viewCountText: 'Community Pick',
      duration: duration.trim() || '45:00',
      academicLevels: [academicLevel],
      fieldsOfStudy: [fieldOfStudy],
      languages: [language],
      topic: topic.trim(),
      category: 'video',
      youtubeId: finalYoutubeId,
      externalUrl: finalExternalUrl,
      description: description.trim() || `Recommended lecture on ${topic} by ${channelOrAuthor}.`,
      isCustom: true,
      createdAt: new Date().toISOString()
    };

    onAddResource(newRes);
    handleReset();
    onClose();
  };

  const handleReset = () => {
    setYoutubeUrl('');
    setExtractedId(null);
    setTitle('');
    setChannelOrAuthor('');
    setTopic('');
    setDuration('45:00');
    setDescription('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <Youtube className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <span>Add YouTube Lecture</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold border border-indigo-200 dark:border-indigo-900">
                  Instant Integration
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Add your favorite Indian teacher or tutorial link to your study hub
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. YouTube Link & Live Thumbnail */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-500" />
              <span>YouTube Video URL or Video ID *</span>
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="e.g. https://www.youtube.com/watch?v=W8G28E34i28 or youtu.be/..."
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
              required
            />

            {/* Live Thumbnail Preview */}
            {extractedId && (
              <div className="mt-2 p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
                <div className="relative w-24 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-zinc-300 dark:border-zinc-700">
                  <img
                    src={getYouTubeThumbnail(extractedId)}
                    alt="YouTube thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-current" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    <Check className="w-3.5 h-3.5" />
                    <span>Valid YouTube Video Detected</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono truncate">
                    ID: {extractedId}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. Lecture Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>Lecture / Video Title *</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Electric Charges and Fields One Shot Class 12 NCERT"
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* 3. Teacher / Educator Name with Quick Suggestions */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-500" />
              <span>Teacher or Channel Name *</span>
            </label>
            <input
              type="text"
              value={channelOrAuthor}
              onChange={(e) => setChannelOrAuthor(e.target.value)}
              placeholder="e.g. Physics Wallah - Alakh Pandey, Dear Sir, Magnet Brains..."
              className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {POPULAR_EDUCATORS.slice(0, 6).map((educator) => (
                <button
                  type="button"
                  key={educator}
                  onClick={() => setChannelOrAuthor(educator)}
                  className="px-2 py-0.5 text-[10px] rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-zinc-200 dark:border-zinc-700/60"
                >
                  +{educator.split('-')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Subject & Academic Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                <span>NCERT Subject *</span>
              </label>
              <select
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value as FieldOfStudy)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {SUBJECT_OPTIONS.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                <span>Academic Level *</span>
              </label>
              <select
                value={academicLevel}
                onChange={(e) => setAcademicLevel(e.target.value as AcademicLevel)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {ACADEMIC_LEVELS.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 5. Topic Tag, Duration & Language */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                <span>Topic / Chapter *</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Electrostatics"
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Duration</span>
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 1:15:00 or 45m"
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LearningLanguage)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 6. Description / Notes about this video */}
          <div className="space-y-1.5">
            <label className="font-bold text-zinc-700 dark:text-zinc-300">
              Why is this lecture helpful? (Optional notes)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Explains Gauss theorem with solved examples and diagrams. Great for CBSE board exams."
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
            />
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Study Resources</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
