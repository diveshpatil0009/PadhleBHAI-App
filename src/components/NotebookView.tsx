import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  BookMarked, 
  FileEdit, 
  Eye, 
  Tag, 
  Sparkles,
  Search,
  BookOpen,
  ArrowLeft,
  Share2,
  FileText,
  ListPlus,
  Bookmark,
  X
} from 'lucide-react';
import { NoteItem } from '../types';
import { SUBJECT_OPTIONS } from '../data/mockResources';

interface NotebookViewProps {
  notes: NoteItem[];
  onSaveNotes: (notes: NoteItem[]) => void;
  onAwardXp: (amount: number, reason: string) => void;
}

const NOTE_TEMPLATES = [
  {
    title: 'NCERT Chapter Revision Template',
    subject: 'NCERT Revision',
    content: `# Chapter Name: [Enter Chapter Title]
**Subject**: [Physics / Chemistry / Math / Biology]
**NCERT Class**: [Class 10 / 11 / 12]

---

## 1. Core Principles & Laws
- **Law 1**: 
- **Key Definition**: 

---

## 2. Master Formula Table
| Concept | Formula | SI Unit |
|:---|:---|:---:|
| Core Equation | $F = m \\cdot a$ | Newton (N) |
| Work Done | $W = F \\cdot d \\cdot \\cos\\theta$ | Joule (J) |

---

## 3. High-Frequency Exam Questions (CBSE / Board)
1. **Derivation**: 
2. **Key Condition / Exception**: 

---

## 4. Common Mistakes & Memory Traps
- Don't confuse ... with ...
- Remember sign conventions:
`
  },
  {
    title: 'Formula & Derivation Cheat Sheet',
    subject: 'Formulas',
    content: `# Quick Formula & Derivation Sheet
**Topic**: [Enter Topic]

## 1. Standard Equations
- Formula 1: 
- Formula 2: 

## 2. Derivation Steps
1. Starting from first principles:
2. Substituting values:
3. Final result:

## 3. Dimensional Analysis
- $[M^a L^b T^c]$
`
  },
  {
    title: 'Active Recall & Doubt Log',
    subject: 'Exam Prep',
    content: `# Active Recall & Mistake Log
**Date**: ${new Date().toLocaleDateString()}

## Question / Problem I Got Wrong:
- **Source**: [NCERT Exemplar / Previous Year Question]
- **My Mistake**: 
- **Correct Solution & Reason**: 

## Self-Test Questions (Answer without looking):
1. What are the 3 conditions for ...?
2. Write down the equation for ...
`
  }
];

export const NotebookView: React.FC<NotebookViewProps> = ({
  notes,
  onSaveNotes,
  onAwardXp
}) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [showMobileList, setShowMobileList] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  // Filter notes by search query and subject
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      const matchSearch = 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchSubject = 
        selectedSubjectFilter === 'all' || 
        n.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase());

      return matchSearch && matchSubject;
    });
  }, [notes, searchQuery, selectedSubjectFilter]);

  const handleCreateNewNote = (templateIndex?: number) => {
    const template = templateIndex !== undefined ? NOTE_TEMPLATES[templateIndex] : null;

    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title: template ? template.title : 'Untitled Study Note',
      subject: template ? template.subject : 'Revision',
      content: template ? template.content : `# New Study Note\n\n## Key Concepts\n- \n\n## Important Formulas\n- \n`,
      updatedAt: new Date().toISOString(),
      tags: ['Revision']
    };
    const updated = [newNote, ...notes];
    onSaveNotes(updated);
    setSelectedNoteId(newNote.id);
    setShowMobileList(false);
    setShowTemplateModal(false);
    onAwardXp(15, 'Created new study note');
  };

  const handleUpdateActiveNote = (fields: Partial<NoteItem>) => {
    if (!activeNote) return;
    const updated = notes.map((n) => {
      if (n.id === activeNote.id) {
        return {
          ...n,
          ...fields,
          updatedAt: new Date().toISOString()
        };
      }
      return n;
    });
    onSaveNotes(updated);
  };

  const handleDeleteNote = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    onSaveNotes(remaining);
    if (remaining.length > 0) {
      setSelectedNoteId(remaining[0].id);
    }
  };

  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = (format: 'md' | 'txt') => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], {
      type: format === 'md' ? 'text/markdown' : 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* Header bar with Stats & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">
              Study Notebook & Chapter Notes
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Personalized markdown notes with formula tables, templates & local autosave
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Templates Button */}
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold transition-colors"
          >
            <ListPlus className="w-3.5 h-3.5 text-indigo-500" />
            <span>Templates</span>
          </button>

          {/* New Note Button */}
          <button
            onClick={() => handleCreateNewNote()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* Main Notebook Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[600px] h-[75vh]">
        {/* Mobile Toggle Button (when viewing an editor on mobile) */}
        <div className="md:hidden p-2.5 bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <button
            onClick={() => setShowMobileList(!showMobileList)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-medium"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>{showMobileList ? 'Hide Notes List' : 'Browse All Notes (' + notes.length + ')'}</span>
          </button>
          {activeNote && (
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300 truncate max-w-[160px]">
              {activeNote.title}
            </span>
          )}
        </div>

        {/* Sidebar: Notes List */}
        <div className={`w-full md:w-80 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-950/40 ${
          showMobileList ? 'block' : 'hidden md:flex'
        }`}>
          {/* Search & Subject filter */}
          <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Quick subject filter */}
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="w-full px-2 py-1 text-[11px] rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-medium"
            >
              <option value="all">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Math">Math</option>
              <option value="Biology">Biology</option>
              <option value="Revision">Revision</option>
            </select>
          </div>

          {/* Note List Scroll */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredNotes.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400">
                No matching notes found.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setShowMobileList(false);
                    }}
                    className={`group cursor-pointer p-3 rounded-xl border text-left transition-all relative ${
                      isSelected
                        ? 'border-indigo-600 bg-white dark:bg-zinc-900 shadow-xs'
                        : 'border-transparent hover:bg-zinc-100/70 dark:hover:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                        {note.title || 'Untitled'}
                      </span>
                      {notes.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteNote(note.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-500 transition-opacity"
                          title="Delete note"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                      {note.content.replace(/[#*`_]/g, '')}
                    </p>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-zinc-400 font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold truncate max-w-[120px]">
                        {note.subject}
                      </span>
                      <span>{new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Editor & Preview Pane */}
        <div className={`flex-1 flex flex-col min-w-0 bg-white dark:bg-zinc-900 ${
          showMobileList ? 'hidden md:flex' : 'flex'
        }`}>
          {activeNote ? (
            <>
              {/* Note Header & Actions */}
              <div className="p-3 sm:p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3 bg-zinc-50/40 dark:bg-zinc-950/30">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={activeNote.title}
                    onChange={(e) => handleUpdateActiveNote({ title: e.target.value })}
                    placeholder="Chapter / Topic Note Title..."
                    className="w-full text-sm sm:text-base font-bold bg-transparent border-0 text-zinc-900 dark:text-white focus:outline-none focus:ring-0"
                  />
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-1.5 text-xs">
                  {/* View / Edit Mode Toggle */}
                  <div className="flex items-center p-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                    <button
                      onClick={() => setIsPreviewMode(false)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                        !isPreviewMode
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
                      }`}
                    >
                      <FileEdit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setIsPreviewMode(true)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors ${
                        isPreviewMode
                          ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-semibold shadow-xs'
                          : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>

                  {/* Copy */}
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                    title="Copy note content"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  {/* Export */}
                  <div className="relative group">
                    <button
                      onClick={() => handleDownload('md')}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                      title="Export Markdown file"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Note Metadata Sub-bar */}
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3 text-xs bg-zinc-50/20 dark:bg-zinc-950/20">
                <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400 shrink-0">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Subject:</span>
                </div>
                <input
                  type="text"
                  value={activeNote.subject}
                  onChange={(e) => handleUpdateActiveNote({ subject: e.target.value })}
                  placeholder="e.g. Physics, Calculus, Organic Chem"
                  className="bg-transparent text-xs text-zinc-800 dark:text-zinc-200 font-medium focus:outline-none flex-1"
                />
                <span className="text-zinc-300 dark:text-zinc-700 hidden sm:inline">|</span>
                <span className="text-[11px] text-zinc-400 hidden sm:inline">
                  Auto-saved in LocalStorage
                </span>
              </div>

              {/* Main Area: Textarea or Formatted Preview */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-xs sm:text-sm">
                {!isPreviewMode ? (
                  <textarea
                    value={activeNote.content}
                    onChange={(e) => handleUpdateActiveNote({ content: e.target.value })}
                    placeholder="Write your study notes, formulas, or chapter summaries in Markdown..."
                    className="w-full h-full bg-transparent resize-none border-0 text-zinc-800 dark:text-zinc-200 focus:outline-none leading-relaxed font-mono"
                  />
                ) : (
                  <div className="font-sans leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap max-w-3xl">
                    <pre className="font-mono text-xs sm:text-sm bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {activeNote.content}
                    </pre>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400 space-y-3">
              <BookMarked className="w-10 h-10 stroke-1 text-zinc-300 dark:text-zinc-700" />
              <p className="text-xs">No active note selected.</p>
              <button
                onClick={() => handleCreateNewNote()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Create First Note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Note Templates Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <ListPlus className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Choose a Study Note Template
                </h3>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {NOTE_TEMPLATES.map((tmpl, index) => (
                <div
                  key={index}
                  onClick={() => handleCreateNewNote(index)}
                  className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer bg-zinc-50/50 dark:bg-zinc-950/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {tmpl.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-200/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-mono">
                      {tmpl.subject}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {tmpl.content.slice(0, 100)}...
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
