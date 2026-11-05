import React from 'react';
import { Course, Exercise, LanguageId, UserProfile } from '../types';
import {
  FileCode2,
  Code,
  Binary,
  Layers,
  Database,
  Cpu,
  CheckCircle2,
  Play,
  Sparkles,
  Lock,
  ArrowRight,
  Flame,
  Trophy,
  RotateCcw
} from 'lucide-react';

interface ChallengesMapProps {
  courses: Course[];
  selectedLanguage: LanguageId;
  onSelectLanguage: (lang: LanguageId) => void;
  profile: UserProfile;
  onSelectExercise: (exercise: Exercise) => void;
  onResetLanguage?: (languageId: LanguageId) => void;
}

export const ChallengesMap: React.FC<ChallengesMapProps> = ({
  courses,
  selectedLanguage,
  onSelectLanguage,
  profile,
  onSelectExercise,
  onResetLanguage
}) => {
  const currentCourse = courses.find(c => c.id === selectedLanguage) || courses[0];
  const allLevelsForLang = currentCourse.lessons.flatMap(l => l.exercises);

  const completedCount = allLevelsForLang.filter(e =>
    profile.completedExerciseIds.includes(e.id)
  ).length;

  const percent = Math.round((completedCount / 30) * 100);

  const getLangIcon = (id: LanguageId) => {
    switch (id) {
      case 'python': return <FileCode2 className="w-4 h-4 text-emerald-500" />;
      case 'javascript': return <Code className="w-4 h-4 text-amber-500" />;
      case 'typescript': return <Binary className="w-4 h-4 text-sky-500" />;
      case 'html_css': return <Layers className="w-4 h-4 text-violet-500" />;
      case 'sql': return <Database className="w-4 h-4 text-cyan-500" />;
      case 'rust': return <Cpu className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Title and Language Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ruta de 30 Niveles por Lenguaje</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
            Retos de {currentCourse.shortName} (30 Niveles)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Selecciona cualquier lenguaje y resuelve sus 30 desafíos interactivos paso a paso.
          </p>
        </div>

        {/* Progress summary and Reset button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {completedCount > 0 && onResetLanguage && (
            <button
              onClick={() => onResetLanguage(currentCourse.id)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
              title={`Volver a comenzar los 30 niveles de ${currentCourse.shortName} desde el Nivel 1`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Comenzar de cero</span>
            </button>
          )}

          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/60 px-4 py-2.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
            <div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Progreso en {currentCourse.shortName}</div>
              <div className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                {completedCount} de 30 Niveles ({percent}%)
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-black text-sm flex items-center justify-center tabular-nums">
              {percent}%
            </div>
          </div>
        </div>
      </div>

      {/* Language Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {courses.map(course => {
          const isSelected = course.id === selectedLanguage;
          const completedInCourse = course.lessons.flatMap(l => l.exercises).filter(e =>
            profile.completedExerciseIds.includes(e.id)
          ).length;

          return (
            <button
              key={course.id}
              onClick={() => onSelectLanguage(course.id)}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                {getLangIcon(course.id)}
                <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                  {completedInCourse}/30
                </span>
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                  {course.shortName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  30 Niveles
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 30 Levels Grid Grouped by Chapters */}
      <div className="space-y-6">
        {currentCourse.lessons.map((lesson, lIdx) => (
          <div
            key={lesson.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4"
          >
            {/* Chapter Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Capítulo {lIdx + 1}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {lesson.summary}
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">
                Niveles {lIdx * 6 + 1} al {lIdx * 6 + 6}
              </span>
            </div>

            {/* 6 Levels per chapter grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lesson.exercises.map(exercise => {
                const isCompleted = profile.completedExerciseIds.includes(exercise.id);

                return (
                  <div
                    key={exercise.id}
                    onClick={() => onSelectExercise(exercise)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex flex-col justify-between ${
                      isCompleted
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500'
                        : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md tabular-nums ${
                            isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          NIVEL {exercise.levelNumber}
                        </span>

                        <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                          +{exercise.xpReward} XP
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {exercise.title.replace(/^Nivel \d+:\s*/, '')}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {exercise.instructions}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>¡Superado!</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold text-[11px]">
                          <Play className="w-3.5 h-3.5" />
                          <span>Resolver Reto</span>
                        </div>
                      )}

                      <span className="text-[10px] font-medium text-slate-400 group-hover:translate-x-0.5 transition-transform">
                        {exercise.difficulty} →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
