import { Course, LanguageId, Lesson } from '../types';
import { ALL_CHALLENGES } from './allChallenges';

function buildLessonsForCourse(lang: LanguageId): Lesson[] {
  const exercises = ALL_CHALLENGES[lang];
  const chapters = [
    { title: 'Módulo 1: Fundamentos y Sintaxis Inicial', summary: 'Primeros pasos, variables y operaciones básicas.' },
    { title: 'Módulo 2: Control de Flujo y Toma de Decisiones', summary: 'Condicionales, operadores lógicos y bucles.' },
    { title: 'Módulo 3: Estructuras de Datos y Colecciones', summary: 'Listas, arrays, diccionarios y manipulación.' },
    { title: 'Módulo 4: Funciones y Modularidad', summary: 'Parámetros, retornos y encapsulación de código.' },
    { title: 'Módulo 5: Algoritmos Prácticos y Proyecto Final', summary: 'Casos reales, optimización y graduación del curso.' }
  ];

  return chapters.map((ch, idx) => {
    const start = idx * 6;
    const end = start + 6;
    return {
      id: `${lang}-mod-${idx + 1}`,
      courseId: lang,
      title: ch.title,
      summary: ch.summary,
      estimatedMinutes: 15,
      exercises: exercises.slice(start, end)
    };
  });
}

export const COURSES: Course[] = [
  {
    id: 'python',
    name: 'Python desde Cero',
    shortName: 'Python',
    tagline: 'Sintaxis limpia, datos y lógica esencial',
    iconName: 'FileCode2',
    badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    accentColor: '#10b981',
    level: 'Principiante a Avanzado',
    description: '30 niveles interactivos para dominar Python desde tu primer Hola Mundo hasta proyectos reales.',
    lessons: buildLessonsForCourse('python')
  },
  {
    id: 'javascript',
    name: 'JavaScript Moderno (ES6+)',
    shortName: 'JavaScript',
    tagline: 'El motor interactivo de la Web',
    iconName: 'Code',
    badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    accentColor: '#f59e0b',
    level: 'Principiante a Avanzado',
    description: '30 niveles prácticos para dominar el lenguaje imprescindible de la web: funciones flecha, arrays y ES6+.',
    lessons: buildLessonsForCourse('javascript')
  },
  {
    id: 'typescript',
    name: 'TypeScript Profesional',
    shortName: 'TypeScript',
    tagline: 'JavaScript con superpoderes de tipado estático',
    iconName: 'Binary',
    badgeColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    accentColor: '#0284c7',
    level: 'Intermedio a Avanzado',
    description: '30 niveles para crear software robusto con interfaces, tipos unión, genéricos y contratos seguros.',
    lessons: buildLessonsForCourse('typescript')
  },
  {
    id: 'html_css',
    name: 'HTML & CSS Estilizado',
    shortName: 'HTML / CSS',
    tagline: 'Maquetación semántica y diseño visual',
    iconName: 'Layers',
    badgeColor: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
    accentColor: '#8b5cf6',
    level: 'Principiante a Avanzado',
    description: '30 niveles para aprender estructura web accesible, Flexbox, formularios interactivos y diseño moderno.',
    lessons: buildLessonsForCourse('html_css')
  },
  {
    id: 'sql',
    name: 'Bases de Datos SQL',
    shortName: 'SQL',
    tagline: 'Consulta, filtra y extrae datos relacionales',
    iconName: 'Database',
    badgeColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    accentColor: '#06b6d4',
    level: 'Principiante a Avanzado',
    description: '30 niveles para consultar datos relacionales con SELECT, WHERE, ORDER BY, agregaciones y JOINs.',
    lessons: buildLessonsForCourse('sql')
  },
  {
    id: 'rust',
    name: 'Rust de Alto Rendimiento',
    shortName: 'Rust',
    tagline: 'Seguridad en memoria y concurrencia sin sobrecoste',
    iconName: 'Cpu',
    badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    accentColor: '#f43f5e',
    level: 'Intermedio a Avanzado',
    description: '30 niveles para dominar la seguridad de memoria, macros y sistemas de alto rendimiento con Rust.',
    lessons: buildLessonsForCourse('rust')
  }
];
