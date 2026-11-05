import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Achievement } from '../types';
import { sound } from '../services/sound';
import { Trophy, Sparkles, Share2, ArrowRight } from 'lucide-react';

interface AchievementUnlockedModalProps {
  achievement: Achievement | null;
  onClose: () => void;
  onOpenShare: (achievementTitle: string) => void;
}

export const AchievementUnlockedModal: React.FC<AchievementUnlockedModalProps> = ({
  achievement,
  onClose,
  onOpenShare
}) => {
  useEffect(() => {
    if (achievement) {
      sound.playAchievementFanfare();
      // Launch colorful confetti burst
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Fallback silently if canvas not supported
      }
    }
  }, [achievement]);

  if (!achievement) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 p-6 text-center shadow-2xl border border-slate-200 dark:border-slate-800">
        {/* Glow emblem */}
        <div className="relative mx-auto w-24 h-24 mb-4">
          <img
            src="/src/assets/images/badge_trophy_showcase_1793881716374.jpg"
            alt="Trofeo de logro desbloqueado"
            className="w-full h-full object-cover rounded-2xl shadow-lg shadow-emerald-500/20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-md">
            <Trophy className="w-4 h-4" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>¡Nuevo Logro Desbloqueado!</span>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {achievement.title}
        </h3>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {achievement.description}
        </p>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Recompensa:</span>
          <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
            +{achievement.xpBonus} XP
          </span>
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={() => {
              onClose();
              onOpenShare(achievement.title);
            }}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-3 text-xs font-bold text-white shadow-md transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir Logro en la Red Social</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Continuar Practicando
          </button>
        </div>
      </div>
    </div>
  );
};
