import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CourseCatalog } from './components/CourseCatalog';
import { CodePlayground } from './components/CodePlayground';
import { CommunityFeed } from './components/CommunityFeed';
import { AchievementsView } from './components/AchievementsView';
import { NotificationModal } from './components/NotificationModal';
import { ShareModal } from './components/ShareModal';
import { AchievementUnlockedModal } from './components/AchievementUnlockedModal';
import { ChallengesMap } from './components/ChallengesMap';
import { UserRegistrationModal } from './components/UserRegistrationModal';
import { UserManagementModal } from './components/UserManagementModal';
import { ResetLanguageConfirmModal } from './components/ResetLanguageConfirmModal';
import { COURSES } from './data/courses';
import { INITIAL_LEADERBOARD } from './data/initialSocial';
import { storage } from './services/storage';
import { sound } from './services/sound';
import { cloudSync } from './services/cloudSync';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import {
  Course,
  Exercise,
  LanguageId,
  UserProfile,
  Achievement,
  SocialPost,
  LeaderboardUser
} from './types';
import { Bell, CheckCircle2, Flame, WifiOff, X } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => storage.getTheme());

  // Navigation tab
  const [activeTab, setActiveTab] = useState<NavTab>('courses');

  // Retos view mode: 'map' (to view all 30 levels) or 'playground' (to code active challenge)
  const [practiceViewMode, setPracticeViewMode] = useState<'map' | 'playground'>('map');

  // Course and Exercise selection
  const [selectedCourseId, setSelectedCourseId] = useState<LanguageId>('python');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(
    COURSES[0].lessons[0].exercises[0]
  );

  // User state
  const [profile, setProfile] = useState<UserProfile>(() => storage.getUserProfile());
  const [achievements, setAchievements] = useState<Achievement[]>(() => storage.getAchievements());
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(() => storage.getSocialPosts());
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>(() => {
    const prof = storage.getUserProfile();
    return INITIAL_LEADERBOARD.map(u => {
      if (u.id === 'current-user') {
        return {
          ...u,
          name: prof.name || 'Tú (Estudiante)',
          handle: prof.handle ? (prof.handle.startsWith('@') ? prof.handle : `@${prof.handle}`) : '@estudiante',
          avatarUrl: prof.avatarUrl || u.avatarUrl,
          xp: prof.xp
        };
      }
      return u;
    });
  });

  // Connectivity
  const { isOnline, simulatedOffline, toggleSimulatedOffline } = useOnlineStatus();

  // Multi-user & Modals
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => storage.getAllUsers());
  const isRegistered = Boolean(profile.isRegistered && profile.firstName?.trim() && profile.lastName?.trim());
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(!isRegistered);
  const [registrationMode, setRegistrationMode] = useState<'create' | 'edit'>('create');
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  const [resetConfirmState, setResetConfirmState] = useState<{
    isOpen: boolean;
    course: Course | null;
    completedLevels: number;
  }>({
    isOpen: false,
    course: null,
    completedLevels: 0
  });

  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareExercise, setShareExercise] = useState<Exercise | null>(null);
  const [shareCodeSnippet, setShareCodeSnippet] = useState<string>('');
  const [shareAchievementTitle, setShareAchievementTitle] = useState<string | undefined>(undefined);
  const [recentlyUnlockedAchievement, setRecentlyUnlockedAchievement] = useState<Achievement | null>(null);

  // In-app toast banner
  const [toastMessage, setToastMessage] = useState<{ title: string; message: string } | null>(null);

  // Apply theme to html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    storage.setTheme(theme);
  }, [theme]);

  // Sync sound service preferences
  useEffect(() => {
    sound.setSoundEnabled(profile.notificationSettings.soundEnabled);
  }, [profile.notificationSettings.soundEnabled]);

  // Handle incoming online events to sync cloud data
  useEffect(() => {
    if (isOnline) {
      cloudSync.syncPendingData().then(res => {
        if (res.syncedItemsCount > 0) {
          showToast('Sincronización en la Nube', `Se sincronizaron ${res.syncedItemsCount} cambios guardados offline.`);
        }
      });
    }
  }, [isOnline]);

  const showToast = (title: string, message: string) => {
    setToastMessage({ title, message });
    setTimeout(() => {
      setToastMessage(prev => (prev?.title === title ? null : prev));
    }, 4500);
  };

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const checkAndUnlockAchievement = (achievementId: string, customProgress?: number) => {
    setAchievements(prevAchievements => {
      let newlyUnlocked: Achievement | null = null;

      const updated = prevAchievements.map(ach => {
        if (ach.id !== achievementId || ach.unlockedAt !== null) {
          return ach;
        }

        const newProg = customProgress !== undefined ? customProgress : ach.progress + 1;
        const isNowUnlocked = newProg >= ach.maxProgress;

        if (isNowUnlocked) {
          const unlockedItem: Achievement = {
            ...ach,
            progress: ach.maxProgress,
            unlockedAt: new Date().toISOString()
          };
          newlyUnlocked = unlockedItem;
          return unlockedItem;
        }

        return { ...ach, progress: newProg };
      });

      if (newlyUnlocked) {
        storage.saveAchievements(updated);
        setRecentlyUnlockedAchievement(newlyUnlocked);

        // Add bonus XP to user profile
        setProfile(prevProfile => {
          const newXp = prevProfile.xp + (newlyUnlocked?.xpBonus || 50);
          const newLevel = Math.floor(newXp / 500) + 1;
          const updatedProfile = { ...prevProfile, xp: newXp, level: newLevel };
          storage.saveUserProfile(updatedProfile);
          return updatedProfile;
        });

        // If offline, enqueue sync
        if (!isOnline) {
          storage.enqueueSync({
            type: 'UNLOCK_ACHIEVEMENT',
            payload: newlyUnlocked
          });
        }
      } else {
        storage.saveAchievements(updated);
      }

      return updated;
    });
  };

  const handleExerciseCompleted = (exercise: Exercise, userCode: string) => {
    const isFirstTime = !profile.completedExerciseIds.includes(exercise.id);

    // Update user profile
    setProfile(prev => {
      const newCompleted = isFirstTime
        ? [...prev.completedExerciseIds, exercise.id]
        : prev.completedExerciseIds;
      const newXp = isFirstTime ? prev.xp + exercise.xpReward : prev.xp;
      const newLevel = Math.floor(newXp / 500) + 1;

      const updated: UserProfile = {
        ...prev,
        completedExerciseIds: newCompleted,
        solvedCodeMap: { ...prev.solvedCodeMap, [exercise.id]: userCode },
        xp: newXp,
        level: newLevel,
        lastActiveDate: new Date().toISOString().split('T')[0]
      };

      storage.saveUserProfile(updated);
      return updated;
    });

    // Update leaderboard for user
    setLeaderboard(prev =>
      prev
        .map(u => (u.isCurrentUser ? { ...u, xp: u.xp + (isFirstTime ? exercise.xpReward : 0) } : u))
        .sort((a, b) => b.xp - a.xp)
        .map((u, i) => ({ ...u, rank: i + 1 }))
    );

    // If offline, enqueue mutation
    if (!isOnline) {
      storage.enqueueSync({
        type: 'COMPLETE_EXERCISE',
        payload: { exerciseId: exercise.id, xpReward: exercise.xpReward, userCode }
      });
      // Check offline master achievement
      checkAndUnlockAchievement('offline_master');
    }

    // Achievements checks
    checkAndUnlockAchievement('first_code');

    // Check Polyglot achievement (exercises completed across 3 distinct languages)
    const distinctLanguages = new Set(
      profile.completedExerciseIds.map(id => {
        for (const c of COURSES) {
          for (const l of c.lessons) {
            if (l.exercises.some(e => e.id === id)) return c.id;
          }
        }
        return 'python';
      })
    );
    distinctLanguages.add(exercise.languageId);
    checkAndUnlockAchievement('polyglot', distinctLanguages.size);

    // Check night owl achievement: solving an exercise in dark mode
    if (theme === 'dark') {
      checkAndUnlockAchievement('night_owl');
    }

    showToast(
      '¡Reto Superado con Éxito! 🎉',
      `Has sumado +${exercise.xpReward} XP. Comparte tu logro con Marc y tus amigos en la red social.`
    );
  };

  const handleAddSocialPost = (content: string, codeSnippet?: string, languageId?: LanguageId) => {
    const newPost: SocialPost = {
      id: 'post_' + Math.random().toString(36).substring(2, 9),
      authorId: profile.id,
      authorName: profile.name,
      authorAvatar: profile.avatarUrl,
      authorHandle: profile.handle,
      content,
      codeSnippet,
      languageId,
      likes: 1,
      hasLiked: true,
      comments: [],
      createdAt: 'Hace un momento',
      pendingSync: !isOnline
    };

    const updated = [newPost, ...socialPosts];
    setSocialPosts(updated);
    storage.saveSocialPosts(updated);

    if (!isOnline) {
      storage.enqueueSync({
        type: 'CREATE_POST',
        payload: newPost
      });
    }

    checkAndUnlockAchievement('social_butterfly');
    showToast('Publicado en la Comunidad 🚀', 'Tu solución ya está disponible en el muro social.');
  };

  const handleToggleLike = (postId: string) => {
    const updated = socialPosts.map(p => {
      if (p.id === postId) {
        const hasLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked,
          likes: hasLiked ? p.likes + 1 : Math.max(0, p.likes - 1)
        };
      }
      return p;
    });

    setSocialPosts(updated);
    storage.saveSocialPosts(updated);

    if (!isOnline) {
      storage.enqueueSync({
        type: 'LIKE_POST',
        payload: { postId }
      });
    }
  };

  const handleAddComment = (postId: string, commentText: string) => {
    const updated = socialPosts.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: 'c_' + Math.random().toString(36).substring(2, 9),
          authorName: profile.name,
          authorAvatar: profile.avatarUrl,
          content: commentText,
          createdAt: 'Hace un momento'
        };
        return {
          ...p,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    });

    setSocialPosts(updated);
    storage.saveSocialPosts(updated);
  };

  const handleRegisterUser = (firstName: string, lastName: string, avatarUrl: string, handle: string) => {
    const fullName = `${firstName} ${lastName}`.trim();
    const formattedHandle = handle.startsWith('@') ? handle : `@${handle}`;

    let updatedProfile: UserProfile;

    if (registrationMode === 'create' && profile.isRegistered && profile.name) {
      // Create new isolated user profile
      updatedProfile = storage.createNewUser(firstName, lastName, avatarUrl, formattedHandle);
      setProfile(updatedProfile);
      setAchievements(storage.getAchievements(updatedProfile.id));
      setAllUsers(storage.getAllUsers());
      // Reset current active exercise to level 1 of current course
      const targetCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
      setCurrentExercise(targetCourse.lessons[0].exercises[0]);
      showToast('¡Nuevo Estudiante Creado!', `Bienvenido ${firstName}. Tu progreso se guardará de forma independiente.`);
    } else {
      // First time registration or editing current user
      updatedProfile = {
        ...profile,
        id: profile.id === 'current-user' ? `usr_${Date.now()}` : profile.id,
        firstName,
        lastName,
        name: fullName,
        handle: formattedHandle,
        avatarUrl,
        isRegistered: true
      };
      setProfile(updatedProfile);
      storage.saveUserProfile(updatedProfile);
      setAllUsers(storage.getAllUsers());
      showToast('¡Perfil Guardado!', `Hola ${firstName}, tu perfil en Programa con Marc está listo.`);
    }

    setIsRegisterModalOpen(false);

    // Update leaderboard current user entry
    setLeaderboard(prev =>
      prev.map(u => {
        if (u.id === 'current-user') {
          return {
            ...u,
            name: fullName,
            handle: formattedHandle,
            avatarUrl,
            xp: updatedProfile.xp
          };
        }
        return u;
      })
    );
  };

  const handleSwitchUser = (userId: string) => {
    const switched = storage.switchUser(userId);
    setProfile(switched);
    setAchievements(storage.getAchievements(userId));
    setAllUsers(storage.getAllUsers());

    // Update leaderboard current user representation
    setLeaderboard(prev =>
      prev.map(u => {
        if (u.id === 'current-user') {
          return {
            ...u,
            name: switched.name,
            handle: switched.handle,
            avatarUrl: switched.avatarUrl,
            xp: switched.xp
          };
        }
        return u;
      })
    );

    // Resume first unsolved exercise for this user in selected course
    const targetCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
    const allCourseExercises = targetCourse.lessons.flatMap(l => l.exercises);
    const nextUnsolved = allCourseExercises.find(e => !switched.completedExerciseIds.includes(e.id))
      || allCourseExercises[0];
    setCurrentExercise(nextUnsolved);

    sound.playSuccess();
    showToast('Sesión Iniciada', `Has cambiado al perfil de ${switched.name}.`);
  };

  const handleRequestResetLanguage = (languageId: LanguageId) => {
    const course = COURSES.find(c => c.id === languageId);
    if (!course) return;
    const completed = course.lessons.flatMap(l => l.exercises).filter(e =>
      profile.completedExerciseIds.includes(e.id)
    ).length;

    setResetConfirmState({
      isOpen: true,
      course,
      completedLevels: completed
    });
  };

  const handleConfirmResetLanguage = (languageId: LanguageId) => {
    const updated = storage.resetLanguageProgress(profile.id, languageId);
    setProfile(updated);
    setAllUsers(storage.getAllUsers());

    // If active exercise is in this language, reset to level 1
    const targetCourse = COURSES.find(c => c.id === languageId);
    if (targetCourse && currentExercise?.languageId === languageId) {
      setCurrentExercise(targetCourse.lessons[0].exercises[0]);
    }

    sound.playSuccess();
    showToast('Curso Reiniciado', `Has comenzado ${targetCourse?.shortName || languageId} de cero desde el Nivel 1.`);
  };

  const handleStartExercise = (exercise: Exercise) => {
    setSelectedCourseId(exercise.languageId);
    setCurrentExercise(exercise);
    setPracticeViewMode('playground');
    setActiveTab('practice');
  };

  const handleOpenShareModalFromExercise = (exercise: Exercise, codeSnippet: string) => {
    setShareExercise(exercise);
    setShareCodeSnippet(codeSnippet);
    setShareAchievementTitle(undefined);
    setIsShareModalOpen(true);
  };

  const handleOpenShareModalForAchievement = (achievementTitle: string) => {
    setShareExercise(null);
    setShareCodeSnippet('');
    setShareAchievementTitle(achievementTitle);
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors pb-20 md:pb-8">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'practice' && activeTab === 'practice') {
            // Toggle between map and playground when re-clicking Retos
            setPracticeViewMode(prev => prev === 'playground' ? 'map' : 'playground');
          }
          setActiveTab(tab);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenNotifications={() => setIsNotificationModalOpen(true)}
        profile={profile}
        isOnline={isOnline}
        simulatedOffline={simulatedOffline}
        onToggleSimulateOffline={toggleSimulatedOffline}
        onOpenProfile={() => setIsUserManagementModalOpen(true)}
      />

      {/* Floating Offline Alert Banner for Mobile if offline */}
      {!isOnline && (
        <div className="sm:hidden bg-amber-500 text-white text-xs py-1.5 px-4 flex items-center justify-between font-medium">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Modo Sin Conexión — Los datos se sincronizarán al reconectar.</span>
          </div>
          <button onClick={toggleSimulatedOffline} className="underline font-bold text-[10px]">
            {simulatedOffline ? 'Reconectar' : ''}
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'courses' && (
          <CourseCatalog
            courses={COURSES}
            profile={profile}
            selectedCourseId={selectedCourseId}
            onSelectCourse={setSelectedCourseId}
            onStartExercise={handleStartExercise}
            onResetLanguage={handleRequestResetLanguage}
          />
        )}

        {activeTab === 'practice' && (
          practiceViewMode === 'playground' && currentExercise ? (
            <div className="h-[calc(100vh-140px)] min-h-[550px]">
              <CodePlayground
                exercise={currentExercise}
                savedCode={profile.solvedCodeMap[currentExercise.id]}
                isOnline={isOnline}
                allExercises={COURSES.flatMap(c => c.lessons.flatMap(l => l.exercises))}
                onExerciseCompleted={handleExerciseCompleted}
                onOpenShareModal={handleOpenShareModalFromExercise}
                onSelectExercise={setCurrentExercise}
                onBackToMap={() => setPracticeViewMode('map')}
              />
            </div>
          ) : (
            <ChallengesMap
              courses={COURSES}
              selectedLanguage={selectedCourseId}
              onSelectLanguage={(lang) => {
                setSelectedCourseId(lang);
                const firstEx = COURSES.find(c => c.id === lang)?.lessons[0].exercises[0];
                if (firstEx) setCurrentExercise(firstEx);
              }}
              profile={profile}
              onSelectExercise={(ex) => {
                setSelectedCourseId(ex.languageId);
                setCurrentExercise(ex);
                setPracticeViewMode('playground');
              }}
              onResetLanguage={handleRequestResetLanguage}
            />
          )
        )}

        {activeTab === 'community' && (
          <CommunityFeed
            posts={socialPosts}
            profile={profile}
            leaderboard={leaderboard}
            onAddPost={handleAddSocialPost}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {activeTab === 'achievements' && (
          <AchievementsView
            achievements={achievements}
            profile={profile}
            onOpenShareModal={handleOpenShareModalForAchievement}
          />
        )}
      </main>

      {/* Ergonomic Mobile Bottom Nav Bar */}
      <MobileBottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* In-App Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm rounded-2xl bg-slate-900 dark:bg-slate-800 text-white p-4 shadow-2xl border border-slate-700 animate-in slide-in-from-bottom duration-300 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 pr-2">
            <h4 className="text-xs font-bold text-white">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toastMessage.message}</p>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        profile={profile}
        onUpdateSettings={(newSettings) => {
          const updated = { ...profile, notificationSettings: newSettings };
          setProfile(updated);
          storage.saveUserProfile(updated);
          showToast('Recordatorios Actualizados', `Marc te recordará estudiar a las ${newSettings.reminderTime}.`);
        }}
        onShowInAppNotification={(title, body) => showToast(title, body)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        exercise={shareExercise}
        codeSnippet={shareCodeSnippet}
        achievementTitle={shareAchievementTitle}
        profile={profile}
        onPublishToCommunity={handleAddSocialPost}
        onNotify={(title, msg) => showToast(title, msg)}
      />

      <AchievementUnlockedModal
        achievement={recentlyUnlockedAchievement}
        onClose={() => setRecentlyUnlockedAchievement(null)}
        onOpenShare={(title) => {
          setRecentlyUnlockedAchievement(null);
          handleOpenShareModalForAchievement(title);
        }}
      />

      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
        activeProfile={profile}
        allUsers={allUsers}
        courses={COURSES}
        onSwitchUser={handleSwitchUser}
        onAddNewUser={() => {
          setRegistrationMode('create');
          setIsRegisterModalOpen(true);
        }}
        onEditActiveProfile={() => {
          setRegistrationMode('edit');
          setIsRegisterModalOpen(true);
        }}
        onRequestResetLanguage={handleRequestResetLanguage}
      />

      <ResetLanguageConfirmModal
        isOpen={resetConfirmState.isOpen}
        course={resetConfirmState.course}
        completedLevels={resetConfirmState.completedLevels}
        onConfirm={handleConfirmResetLanguage}
        onClose={() => setResetConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

      <UserRegistrationModal
        isOpen={isRegisterModalOpen}
        onRegister={handleRegisterUser}
        initialFirstName={registrationMode === 'create' ? '' : (profile.firstName || '')}
        initialLastName={registrationMode === 'create' ? '' : (profile.lastName || '')}
        initialAvatar={profile.avatarUrl}
        canClose={isRegistered}
        onClose={() => setIsRegisterModalOpen(false)}
        title={registrationMode === 'create' ? (allUsers.length > 0 ? '¡Crear Nuevo Estudiante!' : '¡Crea tu Perfil de Estudiante!') : 'Editar Perfil de Estudiante'}
      />
    </div>
  );
}
