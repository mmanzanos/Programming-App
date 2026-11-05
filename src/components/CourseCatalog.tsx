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
  Clock,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  profile: UserProfile;
  selectedCourseId: LanguageId;
  onSelectCourse: (courseId: LanguageId) => void;
  onStartExercise: (exercise: Exercise) => void;
  onResetLanguage?: (languageId: LanguageId) => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  profile,
  selectedCourseId,
  onSelectCourse,
  onStartExercise,
  onResetLanguage
}) => {
  const currentCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileCode2': return <FileCode2 className="w-5 h-5 text-emerald-500" />;
      case 'Code': return <Code className="w-5 h-5 text-amber-500" />;
      case 'Binary': return <Binary className="w-5 h-5 text-sky-500" />;
      case 'Layers': return <Layers className="w-5 h-5 text-violet-500" />;
      case 'Database': return <Database className="w-5 h-5 text-cyan-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-rose-500" />;
      default: return <Code className="w-5 h-5 text-indigo-500" />;
    }
  };

  // Calculate course completion
  const totalExercises = currentCourse.lessons.reduce((acc, l) => acc + l.exercises.length, 0);
  const completedInCourse = currentCourse.lessons.reduce((acc, l) => {
    return acc + l.exercises.filter(e => profile.completedExerciseIds.includes(e.id)).length;
  }, 0);
  const coursePercent = totalExercises > 0 ? Math.round((completedInCourse / totalExercises) * 100) : 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Hero Banner: Studio Desk & Mentorship Intro */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm bg-slate-900 text-white min-h-[220px] sm:min-h-[240px] flex items-center">
        <img
          src="/src/assets/images/hero_marccode_banner_1793881715739.jpg"
          alt="Estudio de desarrollo de Marc"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10 p-6 sm:p-8 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Aprende a Programar desde Cero</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Programa con Marc
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Aprende Python, JavaScript, TypeScript, HTML/CSS, SQL y Rust con ejercicios interactivos, pruebas de código en vivo y soporte 100% offline.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ejercicios Interactivos</span>
            </div>
            <span>·</span>
            <div>Red Social de Estudiantes</div>
            <span>·</span>
            <div>Racha Diaria & Trofeos</div>
          </div>
        </div>
      </div>

      {/* Language Selector Carousel / Grid */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Elige tu Lenguaje de Estudio:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {courses.map(course => {
            const isSelected = course.id === selectedCourseId;
            const exercisesInCourse = course.lessons.reduce((acc, l) => acc + l.exercises.length, 0);
            const solved = course.lessons.reduce((acc, l) => {
              return acc + l.exercises.filter(e => profile.completedExerciseIds.includes(e.id)).length;
            }, 0);

            return (
              <button
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                    {getCourseIcon(course.iconName)}
                  </div>
                  {solved === exercisesInCourse && exercisesInCourse > 0 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                </div>

                <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {course.shortName}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {solved}/{exercisesInCourse} retos
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Course Modules & Interactive Exercises */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xs space-y-6">
        {/* Course Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {currentCourse.level}
              </span>
              <span>·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentCourse.lessons.length} lecciones prácticas
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {currentCourse.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              {currentCourse.description}
            </p>
          </div>

          {/* Progress bar pill & Reset */}
          <div className="sm:text-right shrink-0 space-y-2">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-1 tabular-nums">
                Progreso del Curso: {coursePercent}%
              </div>
              <div className="w-40 sm:w-48 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden sm:ml-auto">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${coursePercent}%` }}
                />
              </div>
            </div>

            {completedInCourse > 0 && onResetLanguage && (
              <button
                onClick={() => onResetLanguage(currentCourse.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                title={`Volver a comenzar los 30 niveles de ${currentCourse.shortName} desde el Nivel 1`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Comenzar de cero</span>
              </button>
            )}
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-4">
          {currentCourse.lessons.map((lesson, lIdx) => (
            <div
              key={lesson.id}
              className="rounded-2xl border border-slate-200 dark:border-slate-800/80 p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>MÓDULO {lIdx + 1}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{lesson.estimatedMinutes} min</span>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    {lesson.summary}
                  </p>
                </div>
              </div>

              {/* Exercises in this lesson */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                {lesson.exercises.map(exercise => {
                  const isCompleted = profile.completedExerciseIds.includes(exercise.id);

                  return (
                    <div
                      key={exercise.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/5 border-emerald-500/20'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isCompleted
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-indigo-500" />
                          )}
                        </div>

                        <div>
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                            {exercise.title}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{exercise.difficulty}</span>
                            <span>·</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                              +{exercise.xpReward} XP
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onStartExercise(exercise)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                          isCompleted
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
                        }`}
                      >
                        <span>{isCompleted ? 'Practicar de nuevo' : 'Resolver Reto'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
