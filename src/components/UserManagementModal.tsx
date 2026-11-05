import React, { useState } from 'react';
import { UserProfile, Course, LanguageId } from '../types';
import {
  User,
  Users,
  UserPlus,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Flame,
  Award,
  ChevronRight,
  X,
  Edit3
} from 'lucide-react';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProfile: UserProfile;
  allUsers: UserProfile[];
  courses: Course[];
  onSwitchUser: (userId: string) => void;
  onAddNewUser: () => void;
  onEditActiveProfile: () => void;
  onRequestResetLanguage: (languageId: LanguageId) => void;
}

export const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  activeProfile,
  allUsers,
  courses,
  onSwitchUser,
  onAddNewUser,
  onEditActiveProfile,
  onRequestResetLanguage
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'languages'>('users');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-500 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Programa con Marc
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Gestión de Estudiantes & Progreso
            </h2>
          </div>
        </div>

        {/* Active Profile Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/5 border border-indigo-500/20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={activeProfile.avatarUrl}
              alt={activeProfile.name}
              className="w-12 h-12 rounded-2xl object-cover bg-white dark:bg-slate-800 border-2 border-indigo-500 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {activeProfile.name || 'Estudiante'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Activo
                </span>
              </div>
              <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {activeProfile.handle || '@estudiante'}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300 font-semibold mt-1">
                <span>{activeProfile.xp} XP</span>
                <span>·</span>
                <span>Nivel {activeProfile.level}</span>
                <span>·</span>
                <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                  <Flame className="w-3 h-3 fill-amber-500" />
                  {activeProfile.streakDays}d racha
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onEditActiveProfile();
            }}
            className="p-2 rounded-xl border border-indigo-200 dark:border-indigo-900/60 hover:bg-white dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 transition-colors"
            title="Editar nombre y apellidos"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-tabs: Cambiar Usuario / Reiniciar Lenguajes */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Cambiar de Usuario ({allUsers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('languages')}
            className={`pb-2.5 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'languages'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Comenzar de Cero Lenguajes</span>
          </button>
        </div>

        {/* Tab 1: All Users List */}
        {activeTab === 'users' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>Perfiles guardados con progreso independiente:</span>
              <button
                onClick={() => {
                  onClose();
                  onAddNewUser();
                }}
                className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline text-xs font-bold"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Nuevo Estudiante</span>
              </button>
            </div>

            <div className="space-y-2">
              {allUsers.map(user => {
                const isActive = user.id === activeProfile.id;
                const solvedCount = user.completedExerciseIds.length;

                return (
                  <div
                    key={user.id}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isActive
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500/50 shadow-xs'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      />
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{user.name}</span>
                          {isActive && (
                            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                              (Activo)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {user.handle}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {solvedCount} retos superados · {user.xp} XP
                        </div>
                      </div>
                    </div>

                    <div>
                      {isActive ? (
                        <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>En uso</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onSwitchUser(user.id);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors"
                        >
                          Seleccionar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Reset Individual Languages to Level 1 */}
        {activeTab === 'languages' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
              <p className="font-bold">Comenzar de cero un lenguaje:</p>
              <p className="text-[11px] mt-0.5 leading-relaxed">
                Permite volver al Nivel 1 en cualquiera de los 6 lenguajes para volver a practicarlo desde el principio. Tu progreso en los demás cursos permanecerá intacto.
              </p>
            </div>

            <div className="space-y-2">
              {courses.map(course => {
                const totalCourse = course.lessons.flatMap(l => l.exercises).length;
                const solvedInLang = course.lessons.flatMap(l => l.exercises).filter(e =>
                  activeProfile.completedExerciseIds.includes(e.id)
                ).length;
                const percent = Math.round((solvedInLang / totalCourse) * 100);

                return (
                  <div
                    key={course.id}
                    className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-extrabold text-xs text-slate-900 dark:text-white">
                        {course.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {solvedInLang} de {totalCourse} niveles completados ({percent}%)
                      </div>
                      <div className="w-32 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden mt-1.5">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onRequestResetLanguage(course.id);
                      }}
                      disabled={solvedInLang === 0}
                      className="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold text-xs disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5 shrink-0"
                      title={solvedInLang === 0 ? 'Aún no has completado retos en este curso' : `Volver a comenzar ${course.shortName} desde el Nivel 1`}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Comenzar de cero</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onAddNewUser();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Crear Nuevo Estudiante</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
