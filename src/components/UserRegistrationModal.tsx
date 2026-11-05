import React, { useState } from 'react';
import { UserProfile } from '../types';
import { sound } from '../services/sound';
import { User, Sparkles, ShieldCheck, CheckCircle2, X } from 'lucide-react';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onRegister: (firstName: string, lastName: string, avatarUrl: string, handle: string) => void;
  initialFirstName?: string;
  initialLastName?: string;
  initialAvatar?: string;
  canClose?: boolean;
  onClose?: () => void;
  title?: string;
}

const AVATAR_OPTIONS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=MarcDev',
  'https://api.dicebear.com/7.x/bottts/svg?seed=LunaCode',
  'https://api.dicebear.com/7.x/bottts/svg?seed=AlexPixel',
  'https://api.dicebear.com/7.x/bottts/svg?seed=SamCoder',
  'https://api.dicebear.com/7.x/bottts/svg?seed=StudentMarc'
];

export const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({
  isOpen,
  onRegister,
  initialFirstName = '',
  initialLastName = '',
  initialAvatar,
  canClose = false,
  onClose,
  title
}) => {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [selectedAvatar, setSelectedAvatar] = useState(initialAvatar || AVATAR_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);

  // Re-sync if initial values change
  React.useEffect(() => {
    if (initialFirstName) setFirstName(initialFirstName);
    if (initialLastName) setLastName(initialLastName);
    if (initialAvatar) setSelectedAvatar(initialAvatar);
  }, [initialFirstName, initialLastName, initialAvatar, isOpen]);

  if (!isOpen) return null;

  // Generate unique handle
  const cleanFirst = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanLast = lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const generatedHandle = cleanFirst && cleanLast
    ? `${cleanFirst}${cleanLast}`
    : cleanFirst || 'estudiante';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      setError('Por favor, introduce tu nombre.');
      return;
    }
    if (!lastName.trim()) {
      setError('Por favor, introduce tus apellidos.');
      return;
    }

    // Append unique suffix to prevent duplicate user handles
    const uniqueSuffix = Math.floor(100 + Math.random() * 900);
    const finalHandle = `${generatedHandle}_${uniqueSuffix}`;

    sound.playSuccess();
    onRegister(firstName.trim(), lastName.trim(), selectedAvatar, finalHandle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {/* Mentor Header Lockup */}
        <div className="text-center space-y-2">
          <div className="relative inline-block mx-auto">
            <img
              src="/src/assets/images/avatar_marc_mentor_1793881715962.jpg"
              alt="Marc Tutor"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-md mx-auto"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Programa con Marc · Registro Único
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {title || '¡Crea tu Perfil de Estudiante!'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Para identificarte de forma única en la red social y en el ranking de la comunidad, escribe tu nombre y apellidos.
            </p>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Nombre y Apellidos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                Nombre <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError(null);
                }}
                placeholder="Ej. Marc"
                autoFocus
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-800 dark:text-slate-200">
                Apellidos <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError(null);
                }}
                placeholder="Ej. Carbonell"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Handle Preview */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Tu usuario en la comunidad:</span>
            <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
              @{generatedHandle}
            </span>
          </div>

          {/* Avatar Selector */}
          <div className="space-y-1.5 pt-1">
            <label className="font-bold text-slate-800 dark:text-slate-200">
              Elige tu Avatar de Desarrollador:
            </label>
            <div className="flex items-center justify-between gap-2">
              {AVATAR_OPTIONS.map((avatar, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`w-11 h-11 rounded-xl p-1 border-2 transition-all ${
                    selectedAvatar === avatar
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 scale-105'
                      : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Guardar y Comenzar a Programar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
