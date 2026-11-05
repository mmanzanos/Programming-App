import React, { useState } from 'react';
import { Exercise, LanguageId, UserProfile } from '../types';
import { sound } from '../services/sound';
import { Share2, Users, Send, Check, Copy, X, Code2, Sparkles } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise?: Exercise | null;
  codeSnippet?: string;
  achievementTitle?: string;
  profile: UserProfile;
  onPublishToCommunity: (content: string, codeSnippet?: string, languageId?: LanguageId, achievementTitle?: string) => void;
  onNotify: (title: string, message: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  exercise,
  codeSnippet = '',
  achievementTitle,
  profile,
  onPublishToCommunity,
  onNotify
}) => {
  const defaultText = exercise
    ? `¡Acabo de completar el reto "${exercise.title}" de ${exercise.languageId.toUpperCase()} en Programa con Marc! 🚀 Sumé +${exercise.xpReward} XP a mi racha.`
    : achievementTitle
    ? `¡Desbloqueé el logro "${achievementTitle}" en Programa con Marc! 🏆 Mi racha diaria sigue creciendo.`
    : '¡Avanzando en mi camino de programación con Marc! 💻';

  const [message, setMessage] = useState(defaultText);
  const [includeCode, setIncludeCode] = useState(Boolean(codeSnippet));
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleShareToCommunity = () => {
    onPublishToCommunity(
      message,
      includeCode ? codeSnippet : undefined,
      exercise?.languageId,
      achievementTitle
    );
    sound.playSuccess();
    onNotify('¡Publicado en la Red Social!', 'Tu avance ahora es visible para tus amigos y la comunidad.');
    onClose();
  };

  const handleExternalShare = async () => {
    const shareData = {
      title: 'Mi progreso en Programa con Marc',
      text: `${message}\n\nAprende a programar tú también desde cero:`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onClose();
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      setCopiedLink(true);
      sound.playNotification();
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Ignored
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Compartir Progreso</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Inspira a tus amigos y a la comunidad de código</p>
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
        <div className="mt-4 space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-800 dark:text-slate-200">
              Mensaje de tu publicación
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs"
              placeholder="Escribe un comentario sobre lo que aprendiste hoy..."
            />
          </div>

          {/* Achievement badge preview if present */}
          {achievementTitle && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="font-semibold">{achievementTitle}</span>
            </div>
          )}

          {/* Code snippet preview checkbox */}
          {codeSnippet && (
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={includeCode}
                  onChange={(e) => setIncludeCode(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Adjuntar código resuelto en la publicación</span>
              </label>

              {includeCode && (
                <div className="p-2.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] max-h-28 overflow-y-auto border border-slate-800">
                  <pre>{codeSnippet}</pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 space-y-2">
          {/* Post to Community Button */}
          <button
            onClick={handleShareToCommunity}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Publicar en la Red Social Integrada</span>
          </button>

          {/* External share / copy button */}
          <button
            onClick={handleExternalShare}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>¡Texto y enlace copiados al portapapeles!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Compartir con amigos (WhatsApp, X, Enlace)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
