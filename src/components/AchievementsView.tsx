import React, { useState } from 'react';
import { Achievement, UserProfile } from '../types';
import {
  Trophy,
  Flame,
  Sparkles,
  Zap,
  Globe,
  Moon,
  WifiOff,
  Share2,
  CheckCircle2,
  Lock,
  Calendar
} from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
  profile: UserProfile;
  onOpenShareModal: (achievementTitle: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  achievements,
  profile,
  onOpenShareModal
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  const unlockedCount = achievements.filter(a => a.unlockedAt !== null).length;
  const nextLevelXp = profile.level * 500;
  const currentLevelProgress = Math.min(100, Math.round((profile.xp % 500) / 5));

  const filteredAchievements = achievements.filter(a => {
    if (filter === 'unlocked') return a.unlockedAt !== null;
    if (filter === 'locked') return a.unlockedAt === null;
    return true;
  });

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Globe': return <Globe className="w-5 h-5 text-sky-500" />;
      case 'Zap': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Moon': return <Moon className="w-5 h-5 text-indigo-400" />;
      case 'WifiOff': return <WifiOff className="w-5 h-5 text-rose-400" />;
      case 'Share2': return <Share2 className="w-5 h-5 text-indigo-500" />;
      case 'Trophy': return <Trophy className="w-5 h-5 text-emerald-500" />;
      default: return <Sparkles className="w-5 h-5 text-amber-500" />;
    }
  };

  // 7-day streak representation
  const weekDays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner: Streak & Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak Flame Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent border border-amber-500/20 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center">
                <Flame className="w-6 h-6 fill-amber-500" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Racha Activa
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                  {profile.streakDays} Días
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-500/20">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
              Historial de la última semana:
            </p>
            <div className="flex items-center justify-between">
              {weekDays.map((day, idx) => {
                const isCompleted = idx < profile.streakDays;
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isCompleted
                          ? 'bg-amber-500 text-white shadow-xs shadow-amber-500/30'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? '🔥' : day}
                    </div>
                    <span className="text-[10px] text-slate-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Level & XP Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-transparent border border-indigo-500/20 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Nivel de Programador
              </span>
              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                Nivel {profile.level}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums mt-1">
              {profile.xp} <span className="text-sm font-semibold text-slate-500">XP Totales</span>
            </h3>
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>Progreso al Nivel {profile.level + 1}</span>
              <span className="tabular-nums font-semibold">{currentLevelProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${currentLevelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Trophies Progress Card */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent border border-emerald-500/20 dark:bg-slate-900 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Insignias Obtenidas
              </span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                {unlockedCount} / {achievements.length}
              </h3>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-500/20 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Cada logro desbloqueado otorga XP extra y motiva tu hábito diario. ¡Comparte tus trofeos en la comunidad!
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Todos ({achievements.length})
          </button>
          <button
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'unlocked'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Desbloqueados ({unlockedCount})
          </button>
          <button
            onClick={() => setFilter('locked')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              filter === 'locked'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Por Desbloquear ({achievements.length - unlockedCount})
          </button>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAchievements.map(ach => {
          const isUnlocked = ach.unlockedAt !== null;
          const progressPercent = Math.min(100, Math.round((ach.progress / ach.maxProgress) * 100));

          return (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
                  : 'bg-slate-50/80 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isUnlocked
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-slate-200/60 dark:bg-slate-800 border border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isUnlocked ? getIcon(ach.icon) : <Lock className="w-4 h-4 text-slate-400" />}
                  </div>

                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full tabular-nums">
                    +{ach.xpBonus} XP
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ach.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                {isUnlocked ? (
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completado</span>
                    </span>
                    <button
                      onClick={() => onOpenShareModal(ach.title)}
                      className="p-1 rounded-md text-slate-400 hover:text-indigo-600 transition-colors"
                      title="Compartir logro en la red social"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Progreso</span>
                      <span className="tabular-nums font-semibold">{ach.progress} / {ach.maxProgress}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
