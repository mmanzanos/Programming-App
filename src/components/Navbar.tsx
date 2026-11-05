import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';
import { Moon, Sun, Bell, Flame } from 'lucide-react';
import { UserProfile } from '../types';

export type NavTab = 'courses' | 'practice' | 'community' | 'achievements';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenNotifications: () => void;
  profile: UserProfile;
  isOnline: boolean;
  simulatedOffline: boolean;
  onToggleSimulateOffline: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  theme,
  onToggleTheme,
  onOpenNotifications,
  profile,
  isOnline,
  simulatedOffline,
  onToggleSimulateOffline,
  onOpenProfile
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark brand */}
        <button
          onClick={() => onSelectTab('courses')}
          className="flex items-center gap-2.5 text-left text-slate-900 dark:text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            &lt;/&gt;
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight block leading-tight">
              Programa con Marc
            </span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold tracking-wider uppercase block">
              CodeMarc Academy
            </span>
          </div>
        </button>

        {/* Zone 2: 4 single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectTab('courses')}
            className={`whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              activeTab === 'courses' ? 'text-indigo-600 dark:text-indigo-400 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Cursos
          </button>
          <button
            onClick={() => onSelectTab('practice')}
            className={`whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              activeTab === 'practice' ? 'text-indigo-600 dark:text-indigo-400 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Retos
          </button>
          <button
            onClick={() => onSelectTab('community')}
            className={`whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              activeTab === 'community' ? 'text-indigo-600 dark:text-indigo-400 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Comunidad
          </button>
          <button
            onClick={() => onSelectTab('achievements')}
            className={`whitespace-nowrap shrink-0 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${
              activeTab === 'achievements' ? 'text-indigo-600 dark:text-indigo-400 underline underline-offset-8 decoration-2' : ''
            }`}
          >
            Logros
          </button>
        </nav>

        {/* Zone 3: 1 primary action & utility controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Offline & Cloud sync status indicator */}
          <div className="hidden sm:block">
            <OfflineIndicator
              isOnline={isOnline}
              simulatedOffline={simulatedOffline}
              onToggleSimulateOffline={onToggleSimulateOffline}
            />
          </div>

          {/* User Profile Badge (Clickable to switch user, edit profile, or reset languages) */}
          {profile.name ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 pl-1.5 pr-2 sm:pr-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer max-w-[115px] sm:max-w-[160px]"
              title={`Perfil: ${profile.name} (${profile.handle || ''}). Clic para gestionar usuarios o progreso.`}
            >
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-5 h-5 rounded-lg object-cover bg-indigo-100 dark:bg-indigo-950 shrink-0"
              />
              <span className="truncate text-[11px] font-bold">
                {profile.firstName || profile.name}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-600 text-white text-[11px] font-bold hover:bg-indigo-500 transition-colors"
            >
              Registrarse
            </button>
          )}

          {/* Streak indicator */}
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-colors"
            onClick={() => onSelectTab('achievements')}
            title={`Racha diaria: ${profile.streakDays} días consecutivos`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span className="tabular-nums">{profile.streakDays}</span>
          </div>

          {/* Notifications Modal Button */}
          <button
            onClick={onOpenNotifications}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            title="Configurar recordatorios de estudio"
          >
            <Bell className="w-4 h-4" />
            {profile.notificationSettings.enabled && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
