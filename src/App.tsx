/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  getStoredProfile, 
  saveProfile, 
  getStoredTasks, 
  saveTasks, 
  getStoredSchedule, 
  saveSchedule, 
  getStoredNotes, 
  saveNotes, 
  getStoredAchievements, 
  saveAchievements, 
  getStoredBookmarks, 
  saveBookmarks, 
  getInitialTheme, 
  saveTheme,
  getStoredCustomResources,
  saveCustomResources,
  getStoredFlashcards,
  saveFlashcards,
  getStoredTestResults,
  saveTestResults,
  getStoredSessionLogs,
  saveSessionLogs
} from './utils/storage';
import { 
  UserProfile, 
  StudyTask, 
  ScheduleBlock, 
  NoteItem, 
  AchievementBadge, 
  Resource, 
  LearningLanguage,
  StudySessionLog
} from './types';
import { Flashcard, TestResult } from './types/testAndFlashcards';
import { MOCK_RESOURCES } from './data/mockResources';
import { XP_TABLE } from './data/achievements';
import { playCelebrationChime } from './utils/sound';

import { Header } from './components/Header';
import { HeroOverview } from './components/HeroOverview';
import { TabsNavigation, ActiveTab } from './components/TabsNavigation';
import { DashboardView } from './components/DashboardView';
import { StudyInsightsView } from './components/StudyInsightsView';
import { ResourcesView } from './components/ResourcesView';
import { FlashcardsView } from './components/FlashcardsView';
import { PlannerView } from './components/PlannerView';
import { NotebookView } from './components/NotebookView';
import { AchievementsView } from './components/AchievementsView';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsDrawer } from './components/SettingsDrawer';
import { FocusModeModal } from './components/FocusModeModal';
import { ResourceViewerModal } from './components/ResourceViewerModal';
import { GamificationDrawer } from './components/GamificationDrawer';
import { AddResourceModal } from './components/AddResourceModal';
import { MockTestModal } from './components/MockTestModal';
import { BackupRestoreModal } from './components/BackupRestoreModal';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

  // Core Data States
  const [profile, setProfile] = useState<UserProfile>(getStoredProfile);
  const [tasks, setTasks] = useState<StudyTask[]>(getStoredTasks);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>(getStoredSchedule);
  const [notes, setNotes] = useState<NoteItem[]>(getStoredNotes);
  const [achievements, setAchievements] = useState<AchievementBadge[]>(getStoredAchievements);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(getStoredBookmarks);
  const [customResources, setCustomResources] = useState<Resource[]>(getStoredCustomResources);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(getStoredFlashcards);
  const [testResults, setTestResults] = useState<TestResult[]>(getStoredTestResults);
  const [sessionLogs, setSessionLogs] = useState<StudySessionLog[]>(getStoredSessionLogs);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Modals & Drawers States
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGamificationOpen, setIsGamificationOpen] = useState<boolean>(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState<boolean>(false);
  const [isAddResourceModalOpen, setIsAddResourceModalOpen] = useState<boolean>(false);
  const [isMockTestOpen, setIsMockTestOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(false);
  const [focusInitialTask, setFocusInitialTask] = useState<string | undefined>(undefined);
  const [activeViewingResource, setActiveViewingResource] = useState<Resource | null>(null);

  // Apply Theme to document HTML element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  // Handle Theme Toggle
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Helper to award XP and evaluate achievements
  const awardXp = (amount: number, reason: string) => {
    setProfile((prev) => {
      const updatedXp = prev.totalXp + amount;
      const updated = { ...prev, totalXp: updatedXp };
      saveProfile(updated);
      return updated;
    });

    // Check achievement progress
    setAchievements((prevBadges) => {
      const updatedBadges = prevBadges.map((badge) => {
        let newProgress = badge.progress;
        if (badge.id === 'century-club') {
          newProgress = profile.totalXp + amount;
        }
        if (badge.id === 'consistent-studier') {
          newProgress = profile.streakDays;
        }
        return {
          ...badge,
          progress: Math.min(badge.maxProgress, newProgress)
        };
      });
      saveAchievements(updatedBadges);
      return updatedBadges;
    });
  };

  // Onboarding completion
  const handleCompleteOnboarding = (updatedProfile: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      ...profile,
      ...updatedProfile,
      onboarded: true
    };
    setProfile(newProfile);
    saveProfile(newProfile);
    awardXp(50, 'Completed Onboarding');
  };

  // Profile update from Settings Drawer
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const newProfile: UserProfile = {
      ...profile,
      ...updated
    };
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  // Quick Language Change
  const handleQuickChangeLanguage = (lang: LearningLanguage) => {
    handleUpdateProfile({ language: lang });
  };

  // Task Handlers
  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        const nextState = !t.completed;
        if (nextState) {
          awardXp(XP_TABLE.TASK_COMPLETED, 'Completed Study Task');
          playCelebrationChime();

          // Increment task achievements
          setAchievements((badges) => {
            const updated = badges.map((b) => {
              if (b.id === 'first-step') return { ...b, progress: 1 };
              if (b.id === 'mastered-subject' && t.priority === 'high') {
                return { ...b, progress: Math.min(b.maxProgress, b.progress + 1) };
              }
              return b;
            });
            saveAchievements(updated);
            return updated;
          });
        }
        return { ...t, completed: nextState };
      }
      return t;
    });
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleAddTask = (newTask: Omit<StudyTask, 'id' | 'createdAt'>) => {
    const created: StudyTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updated = [created, ...tasks];
    setTasks(updated);
    saveTasks(updated);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    saveTasks(updated);
  };

  // Schedule Block update
  const handleUpdateSchedule = (newSchedule: ScheduleBlock[]) => {
    setSchedule(newSchedule);
    saveSchedule(newSchedule);
  };

  // Notes update
  const handleSaveNotes = (newNotes: NoteItem[]) => {
    setNotes(newNotes);
    saveNotes(newNotes);

    // Update notebook achievement
    setAchievements((badges) => {
      const updated = badges.map((b) => {
        if (b.id === 'knowledge-vault') {
          return { ...b, progress: Math.min(b.maxProgress, newNotes.length) };
        }
        return b;
      });
      saveAchievements(updated);
      return updated;
    });
  };

  // Bookmarks handler
  const handleToggleBookmark = (resId: string) => {
    const updated = bookmarkedIds.includes(resId)
      ? bookmarkedIds.filter((id) => id !== resId)
      : [...bookmarkedIds, resId];
    setBookmarkedIds(updated);
    saveBookmarks(updated);
  };

  // Open resource viewer modal & record XP
  const handleOpenResource = (res: Resource) => {
    setActiveViewingResource(res);
    awardXp(XP_TABLE.RESOURCE_VIEWED, 'Inspected Verified Resource');

    // Update resource explorer achievement
    setAchievements((badges) => {
      const updated = badges.map((b) => {
        if (b.id === 'resource-explorer') {
          return { ...b, progress: Math.min(b.maxProgress, b.progress + 1) };
        }
        return b;
      });
      saveAchievements(updated);
      return updated;
    });
  };

  // Focus Mode Trigger
  const handleOpenFocusMode = (customTaskTitle?: string) => {
    setFocusInitialTask(customTaskTitle);
    setIsFocusModeOpen(true);
  };

  // Pomodoro Session Complete Handler
  const handleFocusSessionComplete = (durationMinutes: number, taskTitle?: string) => {
    awardXp(XP_TABLE.POMODORO_SESSION, 'Completed Pomodoro Focus Session');

    setProfile((prev) => {
      const updatedMinutes = prev.totalStudyMinutes + durationMinutes;
      const updated = { ...prev, totalStudyMinutes: updatedMinutes };
      saveProfile(updated);
      return updated;
    });

    // Record completed session in session logs
    const completedLog: StudySessionLog = {
      id: `sess-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toTimeString().slice(0, 5),
      durationMinutes,
      subject: profile.targetSubject.split(' ')[0] || 'Physics',
      taskTitle: taskTitle || focusInitialTask || 'Pomodoro Deep Focus',
      category: 'deep_work',
      xpEarned: XP_TABLE.POMODORO_SESSION
    };
    const updatedSessionLogs = [completedLog, ...sessionLogs];
    setSessionLogs(updatedSessionLogs);
    saveSessionLogs(updatedSessionLogs);

    // Update focus achievements
    setAchievements((badges) => {
      const updated = badges.map((b) => {
        if (b.id === 'deep-diver') {
          return { ...b, progress: Math.min(b.maxProgress, b.progress + 1) };
        }
        if (b.id === 'marathon-scholar') {
          return { ...b, progress: Math.min(b.maxProgress, profile.totalStudyMinutes + durationMinutes) };
        }
        return b;
      });
      saveAchievements(updated);
      return updated;
    });
  };

  // Add Manual Study Session Log
  const handleAddSessionLog = (newLogData: Omit<StudySessionLog, 'id'>) => {
    const created: StudySessionLog = {
      ...newLogData,
      id: `sess-${Date.now()}`
    };
    const updated = [created, ...sessionLogs];
    setSessionLogs(updated);
    saveSessionLogs(updated);

    // Update profile total minutes and award XP
    setProfile((prev) => {
      const updatedMinutes = prev.totalStudyMinutes + newLogData.durationMinutes;
      const updated = { ...prev, totalStudyMinutes: updatedMinutes };
      saveProfile(updated);
      return updated;
    });

    awardXp(created.xpEarned || 25, `Logged study session: ${created.taskTitle}`);
    playCelebrationChime();
  };

  // Reset all local storage data
  const handleResetAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  // Combine custom user-added resources with curated mock resources
  const allResources = useMemo(() => {
    return [...customResources, ...MOCK_RESOURCES];
  }, [customResources]);

  // Add custom YouTube lecture
  const handleAddCustomResource = (newRes: Resource) => {
    const updated = [newRes, ...customResources];
    setCustomResources(updated);
    saveCustomResources(updated);
    awardXp(25, 'Added custom YouTube study resource');
    playCelebrationChime();
  };

  // Delete custom YouTube lecture
  const handleDeleteCustomResource = (id: string) => {
    const updated = customResources.filter((r) => r.id !== id);
    setCustomResources(updated);
    saveCustomResources(updated);
  };

  // Save resource markdown notes directly into user's notebook
  const handleSaveToNotebook = (title: string, subject: string, content: string) => {
    const newNote: NoteItem = {
      id: `note-${Date.now()}`,
      title,
      subject,
      content,
      updatedAt: new Date().toISOString(),
      tags: ['Saved Resource', subject]
    };
    const updated = [newNote, ...notes];
    handleSaveNotes(updated);
    awardXp(20, 'Saved chapter note to Notebook');
  };

  // Update Flashcards
  const handleUpdateFlashcards = (newCards: Flashcard[]) => {
    setFlashcards(newCards);
    saveFlashcards(newCards);
  };

  // Complete Mock Test
  const handleCompleteTest = (result: TestResult, xpEarned: number) => {
    const updatedResults = [result, ...testResults];
    setTestResults(updatedResults);
    saveTestResults(updatedResults);

    // Also record test in session logs for productivity trends
    const testMinutes = Math.max(10, Math.round(result.totalTimeSeconds / 60));
    const testLog: StudySessionLog = {
      id: `sess-test-${Date.now()}`,
      date: result.date,
      startTime: new Date().toTimeString().slice(0, 5),
      durationMinutes: testMinutes,
      subject: result.subject || 'Physics',
      taskTitle: result.testTitle,
      category: 'mock_test',
      xpEarned
    };
    const updatedSessionLogs = [testLog, ...sessionLogs];
    setSessionLogs(updatedSessionLogs);
    saveSessionLogs(updatedSessionLogs);

    awardXp(xpEarned, `Completed ${result.testTitle}`);
    playCelebrationChime();
  };

  // Add Doubt to Notebook from Mock Test
  const handleAddDoubtToNotebook = (title: string, subject: string, content: string) => {
    const newNote: NoteItem = {
      id: `note-doubt-${Date.now()}`,
      title,
      subject,
      content,
      updatedAt: new Date().toISOString(),
      tags: ['Exam Doubt', subject]
    };
    handleSaveNotes([newNote, ...notes]);
    awardXp(15, 'Added exam doubt to Notebook');
  };

  // Callback after full data restoration
  const handleDataRestored = () => {
    setProfile(getStoredProfile());
    setTasks(getStoredTasks());
    setSchedule(getStoredSchedule());
    setNotes(getStoredNotes());
    setAchievements(getStoredAchievements());
    setBookmarkedIds(getStoredBookmarks());
    setCustomResources(getStoredCustomResources());
    setFlashcards(getStoredFlashcards());
    setTestResults(getStoredTestResults());
    setSessionLogs(getStoredSessionLogs());
    setIsBackupModalOpen(false);
  };

  // Filter pinned/recommended resources matching user profile
  const recommendedResources = useMemo(() => {
    // Priority: matching academic level and field of study
    return allResources.filter((r) => {
      const matchesLevel = r.academicLevels.includes(profile.academicLevel);
      const matchesField = r.fieldsOfStudy.includes(profile.fieldOfStudy);
      return matchesLevel || matchesField;
    });
  }, [allResources, profile.academicLevel, profile.fieldOfStudy]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors flex flex-col font-sans">
      {/* 1. Top Navigation Bar */}
      <Header
        profile={profile}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSetTheme={setTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFocusMode={() => handleOpenFocusMode()}
        onOpenGamification={() => setIsGamificationOpen(true)}
        onQuickChangeLanguage={handleQuickChangeLanguage}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-20 sm:pb-6 w-full space-y-4 sm:space-y-6">
        {/* Navigation Tabs */}
        <TabsNavigation
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          savedResourcesCount={bookmarkedIds.length}
        />

        {/* Tab Views Content */}
        <div className="pt-1 sm:pt-2">
          {activeTab === 'dashboard' && (
            <DashboardView
              profile={profile}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              schedule={schedule}
              onOpenFocusMode={handleOpenFocusMode}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenMockTest={() => setIsMockTestOpen(true)}
              onOpenBackupModal={() => setIsBackupModalOpen(true)}
            />
          )}

          {activeTab === 'insights' && (
            <StudyInsightsView
              profile={profile}
              sessionLogs={sessionLogs}
              tasks={tasks}
              testResults={testResults}
              flashcards={flashcards}
              onAddSessionLog={handleAddSessionLog}
              onOpenFocusMode={handleOpenFocusMode}
              onOpenMockTest={() => setIsMockTestOpen(true)}
            />
          )}

          {activeTab === 'resources' && (
            <ResourcesView
              resources={allResources}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              onOpenResource={handleOpenResource}
              onOpenAddModal={() => setIsAddResourceModalOpen(true)}
              onDeleteCustomResource={handleDeleteCustomResource}
              userAcademicLevel={profile.academicLevel}
              userFieldOfStudy={profile.fieldOfStudy}
              userLanguage={profile.language}
            />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardsView
              flashcards={flashcards}
              onUpdateFlashcards={handleUpdateFlashcards}
              onAwardXp={awardXp}
              userFieldOfStudy={profile.fieldOfStudy}
              userAcademicLevel={profile.academicLevel}
            />
          )}

          {activeTab === 'planner' && (
            <PlannerView
              schedule={schedule}
              onUpdateSchedule={handleUpdateSchedule}
              onOpenFocusMode={handleOpenFocusMode}
              profile={profile}
              onAwardXp={awardXp}
            />
          )}

          {activeTab === 'notebook' && (
            <NotebookView
              notes={notes}
              onSaveNotes={handleSaveNotes}
              onAwardXp={awardXp}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              profile={profile}
              achievements={achievements}
              onOpenFocusMode={() => handleOpenFocusMode()}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-xs text-zinc-500 dark:text-zinc-400 mb-12 sm:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200">StudyPulse</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Auth Privacy Focused Study Companion</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-zinc-400">
            <span>All study data stored locally in HTML5 LocalStorage</span>
            <button
              onClick={() => setIsBackupModalOpen(true)}
              className="hover:underline text-indigo-500 font-medium"
            >
              Backup & Print
            </button>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:underline text-indigo-500 font-medium"
            >
              Preferences
            </button>
          </div>
        </div>
      </footer>

      {/* Onboarding Modal (First time visit) */}
      <OnboardingModal
        isOpen={!profile.onboarded}
        onComplete={handleCompleteOnboarding}
      />

      {/* Settings & Profile Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        theme={theme}
        onSetTheme={setTheme}
        onSaveProfile={handleUpdateProfile}
        onResetAllData={handleResetAllData}
      />

      {/* Focus Mode Overlay (Pomodoro + Ambient Generator) */}
      <FocusModeModal
        isOpen={isFocusModeOpen}
        onClose={() => setIsFocusModeOpen(false)}
        tasks={tasks}
        initialTaskTitle={focusInitialTask}
        onSessionComplete={handleFocusSessionComplete}
      />

      {/* Resource Viewer Modal (YouTube Player & Markdown Reader) */}
      <ResourceViewerModal
        resource={activeViewingResource}
        onClose={() => setActiveViewingResource(null)}
        onSaveToNotebook={handleSaveToNotebook}
      />

      {/* Add Custom YouTube Lecture Modal */}
      <AddResourceModal
        isOpen={isAddResourceModalOpen}
        onClose={() => setIsAddResourceModalOpen(false)}
        onAddResource={handleAddCustomResource}
        defaultAcademicLevel={profile.academicLevel}
        defaultFieldOfStudy={profile.fieldOfStudy}
        defaultLanguage={profile.language}
      />

      {/* Interactive Mock Test Simulator Modal */}
      <MockTestModal
        isOpen={isMockTestOpen}
        onClose={() => setIsMockTestOpen(false)}
        userFieldOfStudy={profile.fieldOfStudy}
        userAcademicLevel={profile.academicLevel}
        onCompleteTest={handleCompleteTest}
        onAddDoubtToNotebook={handleAddDoubtToNotebook}
      />

      {/* Data Backup & Print Handouts Modal */}
      <BackupRestoreModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        resources={allResources}
        notes={notes}
        onDataRestored={handleDataRestored}
      />

      {/* Gamification Badges Drawer */}
      <GamificationDrawer
        isOpen={isGamificationOpen}
        onClose={() => setIsGamificationOpen(false)}
        profile={profile}
        achievements={achievements}
      />
    </div>
  );
}
