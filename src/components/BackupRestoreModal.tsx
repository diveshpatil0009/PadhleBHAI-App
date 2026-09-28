import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  Printer, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  Database,
  RefreshCw
} from 'lucide-react';
import { exportAllStudyData, importAllStudyData } from '../utils/storage';
import { Resource, NoteItem } from '../types';

interface BackupRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  notes: NoteItem[];
  onDataRestored: () => void;
}

export const BackupRestoreModal: React.FC<BackupRestoreModalProps> = ({
  isOpen,
  onClose,
  resources,
  notes,
  onDataRestored
}) => {
  const [activeTab, setActiveTab] = useState<'backup' | 'print'>('backup');
  const [importStatus, setImportStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [selectedNoteToPrint, setSelectedNoteToPrint] = useState<string>(notes[0]?.id || '');
  const [selectedResourceToPrint, setSelectedResourceToPrint] = useState<string>('');

  if (!isOpen) return null;

  const handleExportJson = () => {
    const jsonStr = exportAllStudyData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studypulse-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      const success = importAllStudyData(content);
      if (success) {
        setImportStatus({
          success: true,
          message: 'All study notes, tasks, custom videos, and progress restored successfully!'
        });
        setTimeout(() => {
          onDataRestored();
        }, 1200);
      } else {
        setImportStatus({
          success: false,
          message: 'Invalid backup file format. Please check the JSON file.'
        });
      }
    };
    reader.readAsText(file);
  };

  const handlePrintHandout = () => {
    window.print();
  };

  const printItem = selectedResourceToPrint
    ? resources.find((r) => r.id === selectedResourceToPrint)
    : notes.find((n) => n.id === selectedNoteToPrint);

  const printContent = printItem 
    ? ('contentMarkdown' in printItem ? (printItem.contentMarkdown || printItem.description) : ('content' in printItem ? printItem.content : ''))
    : '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-white">
                Data Backup & Print Handouts
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Export/restore full local JSON data or print clean exam study sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'backup'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Full Data Backup & Restore</span>
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'print'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold'
                : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:text-zinc-400'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print PDF Study Handouts</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
          {activeTab === 'backup' ? (
            <div className="space-y-5">
              {importStatus && (
                <div className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs ${
                  importStatus.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                }`}>
                  {importStatus.success ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                  <span>{importStatus.message}</span>
                </div>
              )}

              {/* 1. Export JSON */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm">
                      Export Everything (.json)
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                      Saves your notes, tasks, custom YouTube videos, bookmarks, and test history.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJson}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Backup</span>
                  </button>
                </div>
              </div>

              {/* 2. Import JSON */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 space-y-3">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm">
                    Restore from Backup
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs">
                    Upload a previously downloaded StudyPulse JSON file to restore your full study hub on any device.
                  </p>
                </div>

                <div className="pt-2">
                  <label className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-indigo-500 cursor-pointer bg-white dark:bg-zinc-900 transition-colors">
                    <Upload className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      Choose JSON Backup File
                    </span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/40 flex items-start gap-2 text-indigo-800 dark:text-indigo-300">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                <span className="text-[11px] leading-relaxed">
                  Your study data is 100% private and stored in your browser's local storage. No external servers or credentials required.
                </span>
              </div>
            </div>
          ) : (
            /* Print Handouts Tab */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-bold text-zinc-700 dark:text-zinc-300 block">
                  Select Chapter Note or Formula Sheet to Print
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-400">Curated Chapter Notes / Sheets:</span>
                    <select
                      value={selectedResourceToPrint}
                      onChange={(e) => {
                        setSelectedResourceToPrint(e.target.value);
                        setSelectedNoteToPrint('');
                      }}
                      className="w-full p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs"
                    >
                      <option value="">-- Choose Curated Note --</option>
                      {resources.filter(r => r.category === 'notes' || r.category === 'cheatsheet').map(r => (
                        <option key={r.id} value={r.id}>{r.title.slice(0, 45)}...</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-zinc-400">My Notebook Notes:</span>
                    <select
                      value={selectedNoteToPrint}
                      onChange={(e) => {
                        setSelectedNoteToPrint(e.target.value);
                        setSelectedResourceToPrint('');
                      }}
                      className="w-full p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs"
                    >
                      <option value="">-- Choose My Note --</option>
                      {notes.map(n => (
                        <option key={n.id} value={n.id}>{n.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Print Preview Box */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 max-h-60 overflow-y-auto text-xs font-mono whitespace-pre-wrap leading-relaxed">
                {printContent || 'Select a chapter note or notebook entry to preview and print.'}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handlePrintHandout}
                  disabled={!printContent}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-40 shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
