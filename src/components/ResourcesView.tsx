import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Bookmark, 
  CheckCircle, 
  Eye, 
  Clock, 
  ExternalLink, 
  FileText, 
  Video, 
  Layers, 
  X,
  Play,
  Plus,
  BookOpen,
  Sparkles,
  Trash2,
  Share2,
  BookMarked
} from 'lucide-react';
import { Resource, AcademicLevel, FieldOfStudy, ResourceCategory, LearningLanguage } from '../types';
import { ACADEMIC_LEVELS, SUBJECT_OPTIONS } from '../data/mockResources';
import { getYouTubeThumbnail, getYouTubeWatchUrl, extractYouTubeId } from '../utils/youtube';

interface ResourcesViewProps {
  resources: Resource[];
  bookmarkedIds: string[];
  onToggleBookmark: (resourceId: string) => void;
  onOpenResource: (resource: Resource) => void;
  onOpenAddModal: () => void;
  onDeleteCustomResource?: (resourceId: string) => void;
  userAcademicLevel: AcademicLevel;
  userFieldOfStudy: FieldOfStudy;
  userLanguage: LearningLanguage;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({
  resources,
  bookmarkedIds,
  onToggleBookmark,
  onOpenResource,
  onOpenAddModal,
  onDeleteCustomResource,
  userAcademicLevel,
  userFieldOfStudy,
  userLanguage
}) => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedField, setSelectedField] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState<boolean>(false);
  const [onlyCustom, setOnlyCustom] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'views' | 'title' | 'duration'>('views');

  // Extract unique topic tags
  const allTopicTags = useMemo(() => {
    const tags = new Set<string>();
    resources.forEach((r) => {
      if (r.topic) tags.add(r.topic);
    });
    return Array.from(tags).sort();
  }, [resources]);

  // Filter & Sort Pipeline
  const filteredResources = useMemo(() => {
    return resources
      .filter((res) => {
        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = res.title.toLowerCase().includes(q);
          const matchAuthor = res.channelOrAuthor.toLowerCase().includes(q);
          const matchDesc = res.description.toLowerCase().includes(q);
          const matchTopic = res.topic.toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchDesc && !matchTopic) return false;
        }

        // Bookmark filter
        if (onlyBookmarked && !bookmarkedIds.includes(res.id)) {
          return false;
        }

        // Custom resource filter
        if (onlyCustom && !res.isCustom) {
          return false;
        }

        // Academic level filter
        if (selectedLevel !== 'all' && !res.academicLevels.includes(selectedLevel as AcademicLevel)) {
          return false;
        }

        // Field filter
        if (selectedField !== 'all' && !res.fieldsOfStudy.includes(selectedField as FieldOfStudy)) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && res.category !== selectedCategory) {
          return false;
        }

        // Topic tag filter
        if (selectedTag !== 'all' && res.topic !== selectedTag) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Put custom resources on top if recently added
        if (a.isCustom && !b.isCustom) return -1;
        if (!a.isCustom && b.isCustom) return 1;

        if (sortBy === 'views') {
          return b.viewCount - a.viewCount;
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'duration') {
          return (a.duration || '').localeCompare(b.duration || '');
        }
        return 0;
      });
  }, [
    resources,
    searchQuery,
    selectedLevel,
    selectedField,
    selectedCategory,
    selectedTag,
    onlyBookmarked,
    onlyCustom,
    sortBy,
    bookmarkedIds
  ]);

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedLevel !== 'all' ||
    selectedField !== 'all' ||
    selectedCategory !== 'all' ||
    selectedTag !== 'all' ||
    onlyBookmarked ||
    onlyCustom;

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLevel('all');
    setSelectedField('all');
    setSelectedCategory('all');
    setSelectedTag('all');
    setOnlyBookmarked(false);
    setOnlyCustom(false);
  };

  const customCount = resources.filter((r) => r.isCustom).length;
  const notesCount = resources.filter((r) => r.category === 'notes').length;

  return (
    <div className="space-y-5">
      {/* Top Banner & Action */}
      <div className="bg-gradient-to-r from-indigo-900/10 via-indigo-600/5 to-purple-600/10 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-purple-950/30 border border-indigo-200/60 dark:border-indigo-900/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Curated NCERT & Verified Educator Hub</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
            Smart Resource Aggregator
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-xl mt-0.5">
            Top lectures by Indian educators (Physics Wallah, Dear Sir, Magnet Brains) + in-depth NCERT chapter revision notes. You can also paste your own YouTube lectures!
          </p>
        </div>

        {/* Add YouTube Resource CTA Button */}
        <button
          onClick={onOpenAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add YouTube Lecture</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5">
        {/* Search input & Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search NCERT lectures, Indian teachers (PW, Dear Sir, Magnet Brains) or chapter notes..."
              className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 px-3 py-2 font-medium"
            >
              <option value="views">Most Viewed (Top Educators)</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="duration">Duration</option>
            </select>
          </div>
        </div>

        {/* Filter Controls Row (Responsive wrapping with clean touch targets) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
          {/* Resource Category Buttons */}
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-x-auto max-w-full">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-white dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedCategory('video')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'video'
                  ? 'bg-white dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Lectures</span>
            </button>
            <button
              onClick={() => setSelectedCategory('notes')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'notes'
                  ? 'bg-white dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              <span>Chapter Notes ({notesCount})</span>
            </button>
            <button
              onClick={() => setSelectedCategory('cheatsheet')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedCategory === 'cheatsheet'
                  ? 'bg-white dark:bg-zinc-900 font-semibold text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Formula Sheets</span>
            </button>
          </div>

          {/* Academic Level Dropdown */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium max-w-[150px] sm:max-w-none truncate"
          >
            <option value="all">All Academic Levels</option>
            {ACADEMIC_LEVELS.map((lvl) => (
              <option key={lvl.id} value={lvl.id}>
                {lvl.badge} - {lvl.label}
              </option>
            ))}
          </select>

          {/* Field of Study Dropdown */}
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium max-w-[150px] sm:max-w-none truncate"
          >
            <option value="all">All NCERT Subjects</option>
            {SUBJECT_OPTIONS.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.label}
              </option>
            ))}
          </select>

          {/* Topic Tags Dropdown */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs font-medium max-w-[140px] sm:max-w-none truncate"
          >
            <option value="all">All Topics</option>
            {allTopicTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          {/* Bookmarked Filter Toggle */}
          <button
            onClick={() => setOnlyBookmarked(!onlyBookmarked)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              onlyBookmarked
                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${onlyBookmarked ? 'fill-current' : ''}`} />
            <span>Saved</span>
          </button>

          {/* Custom Resources Filter */}
          {customCount > 0 && (
            <button
              onClick={() => setOnlyCustom(!onlyCustom)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
                onlyCustom
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Added by You ({customCount})</span>
            </button>
          )}

          {/* Clear Filters Button if any active */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline px-2 py-1 ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          Showing <span className="font-semibold text-zinc-900 dark:text-white">{filteredResources.length}</span> resources
        </div>
        <div className="text-xs text-zinc-400 hidden sm:block">
          Click any lecture or chapter note to study immediately
        </div>
      </div>

      {/* Resources Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-10 text-center space-y-3">
          <Layers className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            No matching resources found
          </h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try adjusting your search keywords, or add your preferred YouTube lecture to the list!
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={resetFilters}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              Clear Filters
            </button>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add This Lecture</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((res) => {
            const isBookmarked = bookmarkedIds.includes(res.id);
            const isVideo = res.category === 'video';
            const isNotes = res.category === 'notes';
            const ytId = res.youtubeId || (res.externalUrl ? extractYouTubeId(res.externalUrl) ?? undefined : undefined);
            const hasThumbnail = isVideo && !!ytId;
            const watchUrl = getYouTubeWatchUrl(ytId, res.externalUrl);

            return (
              <div
                key={res.id}
                className={`bg-white dark:bg-zinc-900 border rounded-2xl p-4 sm:p-5 shadow-xs transition-all flex flex-col justify-between group ${
                  res.isCustom
                    ? 'border-indigo-300/80 dark:border-indigo-800/80 ring-1 ring-indigo-500/20'
                    : isNotes
                    ? 'border-emerald-200/80 dark:border-emerald-950/60 hover:border-emerald-400 dark:hover:border-emerald-800'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="space-y-3">
                  {/* Video Thumbnail (for YouTube lectures) */}
                  {hasThumbnail && (
                    <div 
                      onClick={() => onOpenResource(res)}
                      className="relative w-full aspect-video rounded-xl overflow-hidden bg-zinc-900 cursor-pointer border border-zinc-200/50 dark:border-zinc-800 group/thumb"
                    >
                      <img
                        src={getYouTubeThumbnail(ytId)}
                        alt={res.title}
                        className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes('mqdefault')) {
                            target.src = getYouTubeThumbnail(ytId, 'mq');
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-between p-2.5">
                        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover/thumb:scale-110 transition-transform">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                        {res.duration && (
                          <span className="px-2 py-0.5 rounded-md bg-black/80 text-white font-mono text-[10px] font-semibold">
                            {res.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata Header: Category & Topic */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {res.isCustom ? (
                        <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          Added by You
                        </span>
                      ) : isNotes ? (
                        <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>Chapter Note</span>
                        </span>
                      ) : (
                        <span className="font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          {res.category}
                        </span>
                      )}

                      <span aria-hidden="true">·</span>
                      <span className="truncate max-w-[130px] font-medium">{res.topic}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Delete Custom Resource Button */}
                      {res.isCustom && onDeleteCustomResource && (
                        <button
                          type="button"
                          onClick={() => onDeleteCustomResource(res.id)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          title="Remove custom resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Bookmark button */}
                      <button
                        type="button"
                        onClick={() => onToggleBookmark(res.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isBookmarked
                            ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        }`}
                        title={isBookmarked ? 'Remove from saved' : 'Save resource'}
                      >
                        <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => onOpenResource(res)}
                    className="cursor-pointer text-sm sm:text-base font-bold text-zinc-900 dark:text-white leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {res.title}
                  </h3>

                  {/* Author / Channel & Verified Badge */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 truncate">
                      <span className="font-semibold truncate">{res.channelOrAuthor}</span>
                      {res.isVerified && (
                        <span title="Verified Recognized Educator" className="inline-flex items-center shrink-0">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20" />
                        </span>
                      )}
                    </div>

                    {res.readingTime && (
                      <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span>{res.readingTime}</span>
                      </span>
                    )}
                  </div>

                  {/* High-yield Notes Key Points preview if available */}
                  {res.keyPoints && res.keyPoints.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-100 dark:border-zinc-800/80 space-y-1">
                      <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                        Key Coverage
                      </div>
                      <ul className="space-y-1 text-[11px] text-zinc-600 dark:text-zinc-300">
                        {res.keyPoints.slice(0, 2).map((kp, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 line-clamp-1">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span className="truncate">{kp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Description */}
                  {(!res.keyPoints || res.keyPoints.length === 0) && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  )}
                </div>

                {/* Bottom Stats & Launch Button */}
                <div className="pt-3.5 mt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{res.viewCountText}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {watchUrl && (
                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Watch directly on YouTube (New Tab)"
                        className="p-1.5 rounded-lg text-red-600/80 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => onOpenResource(res)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                        isNotes
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900'
                      }`}
                    >
                      {isVideo ? (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Watch</span>
                        </>
                      ) : isNotes ? (
                        <>
                          <BookOpen className="w-3 h-3" />
                          <span>Read Notes</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3 h-3" />
                          <span>View Sheet</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
