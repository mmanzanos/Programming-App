import React, { useState } from 'react';
import { UserProfile } from '../types';
import { sound } from '../services/sound';
import { Bell, Clock, Volume2, Check, X, Sparkles, AlertCircle } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateSettings: (settings: UserProfile['notificationSettings']) => void;
  onShowInAppNotification: (title: string, message: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateSettings,
  onShowInAppNotification
}) => {
  const [settings, setSettings] = useState(profile.notificationSettings);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const daysLabels = [
    { id: 1, label: 'L' },
    { id: 2, label: 'M' },
    { id: 3, label: 'X' },
    { id: 4, label: 'J' },
    { id: 5, label: 'V' },
    { id: 6, label: 'S' },
    { id: 0, label: 'D' }
  ];

  const handleToggleDay = (dayId: number) => {
    const exists = settings.daysOfWeek.includes(dayId);
    const newDays = exists
      ? settings.daysOfWeek.filter(d => d !== dayId)
      : [...settings.daysOfWeek, dayId];
    setSettings(prev => ({ ...prev, daysOfWeek: newDays }));
  };

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermission(perm);
        if (perm === 'granted') {
          sound.playSuccess();
        }
      } catch (e) {
        console.error('Error requesting notification permission', e);
      }
    }
  };

  const handleTestNotification = () => {
    sound.playNotification();
    const title = '¡Hora de programar con Marc! 🚀';
    const body = `Mantén viva tu racha de ${profile.streakDays} días. 15 minutos hoy marcarán la diferencia en tus metas.`;

    onShowInAppNotification(title, body);

    if (browserPermission === 'granted' && 'Notification' in window) {
      try {
        new Notification(title, {
          body,
          icon: '/public/pwa-192x192.png'
        });
      } catch {
        // Fallback handled in-app
      }
    }
  };

  const handleSave = () => {
    onUpdateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recordatorios de Estudio</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Notificaciones personalizadas para tu práctica diaria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4 text-xs">
          {/* Main switch */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800">
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Activar recordatorio diario</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Marc te avisará para no perder tu racha de fuego</p>
            </div>
            <button
              onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {settings.enabled && (
            <>
              {/* Reminder time */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Hora de estudio preferida</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={settings.reminderTime}
                    onChange={(e) => setSettings(s => ({ ...s, reminderTime: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-[11px] text-slate-500 whitespace-nowrap">Hora local</span>
                </div>
              </div>

              {/* Days selection */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 dark:text-slate-200">
                  Días de la semana para practicar
                </label>
                <div className="flex items-center justify-between gap-1">
                  {daysLabels.map((d) => {
                    const active = settings.daysOfWeek.includes(d.id);
                    return (
                      <button
                        key={d.id}
                        type="button"
                        onClick={() => handleToggleDay(d.id)}
                        className={`w-9 h-9 rounded-lg font-bold text-xs transition-colors ${
                          active
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sound chime toggle */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-700 dark:text-slate-300">Tono de alerta audible</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings(s => ({ ...s, soundEnabled: e.target.checked }))}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </div>

              {/* Browser notification permission */}
              {browserPermission !== 'granted' ? (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-medium">Habilitar avisos del navegador</p>
                    <p className="text-[11px] opacity-90">Permite notificaciones del sistema para que te lleguen incluso con la pestaña en segundo plano.</p>
                    <button
                      type="button"
                      onClick={handleRequestPermission}
                      className="mt-1 px-2.5 py-1 rounded bg-amber-600 text-white text-[11px] font-semibold hover:bg-amber-500 transition-colors"
                    >
                      Permitir en este navegador
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Permiso del sistema concedido para notificaciones</span>
                </div>
              )}
            </>
          )}

          {/* Test button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleTestNotification}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Probar Notificación Ahora</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors flex items-center justify-center gap-1.5"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <span>Guardar Configuración</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
