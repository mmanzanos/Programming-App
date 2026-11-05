import { Achievement } from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_code',
    title: 'Primeros Pasos',
    description: 'Resuelve tu primer ejercicio interactivo de código.',
    category: 'learning',
    icon: 'Sparkles',
    xpBonus: 50,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'polyglot',
    title: 'Políglota del Código',
    description: 'Resuelve ejercicios en al menos 3 lenguajes de programación diferentes.',
    category: 'learning',
    icon: 'Globe',
    xpBonus: 100,
    unlockedAt: null,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'streak_3',
    title: 'Constancia Diaria',
    description: 'Mantén una racha de práctica de 3 días consecutivos.',
    category: 'streak',
    icon: 'Flame',
    xpBonus: 80,
    unlockedAt: null,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'streak_7',
    title: 'Semana Imparable',
    description: 'Completa 7 días de estudio diario seguidos sin romper la racha.',
    category: 'streak',
    icon: 'Zap',
    xpBonus: 200,
    unlockedAt: null,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'night_owl',
    title: 'Noctámbulo de Código',
    description: 'Activa y estudia en el Modo Oscuro para sesiones nocturnas.',
    category: 'night',
    icon: 'Moon',
    xpBonus: 40,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'offline_master',
    title: 'Maestro Offline',
    description: 'Completa y guarda un ejercicio sin conexión a internet.',
    category: 'learning',
    icon: 'WifiOff',
    xpBonus: 75,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'social_butterfly',
    title: 'Voz de la Comunidad',
    description: 'Comparte tu progreso o un snippet de código en la red social integrada.',
    category: 'social',
    icon: 'Share2',
    xpBonus: 60,
    unlockedAt: null,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'clean_coder',
    title: 'Desarrollador Fino',
    description: 'Supera 3 ejercicios al primer intento sin solicitar pistas.',
    category: 'learning',
    icon: 'Trophy',
    xpBonus: 120,
    unlockedAt: null,
    progress: 0,
    maxProgress: 3
  }
];
