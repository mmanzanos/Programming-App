import React from 'react';
import { Course, LanguageId } from '../types';
import { RotateCcw, AlertTriangle, X } from 'lucide-react';

interface ResetLanguageConfirmModalProps {
  isOpen: boolean;
  course: Course | null;
  completedLevels: number;
  onConfirm: (languageId: LanguageId) => void;
  onClose: () => void;
}

export const ResetLanguageConfirmModal: React.FC<ResetLanguageConfirmModalProps> = ({
  isOpen,
  course,
  completedLevels,
  onConfirm,
  onClose
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Cancelar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Reiniciar Lenguaje de Cero
            </span>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              ¿Comenzar de cero {course.name}?
            </h3>
          </div>
        </div>

        {/* Explanatory Note */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <p>
            Tienes <strong>{completedLevels} de 30 niveles</strong> completados en <strong>{course.shortName}</strong>.
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Al comenzar de cero este lenguaje, tus retos volverán al <strong>Nivel 1</strong> y se restablecerán las soluciones escritas en {course.shortName}. El progreso de tus otros cursos no sufrirá ningún cambio.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onConfirm(course.id);
              onClose();
            }}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-600/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sí, comenzar de cero</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
