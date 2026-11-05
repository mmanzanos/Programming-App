import { SocialPost, LeaderboardUser } from '../types';

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-marc-1',
    authorId: 'marc-mentor',
    authorName: 'Marc',
    authorAvatar: '/src/assets/images/avatar_marc_mentor_1793881715962.jpg',
    authorHandle: 'marc_tutor',
    isMarc: true,
    content: '¡Bienvenidos a todos a Programa con Marc! 🚀 Recuerda: la consistencia diaria vence al talento esporádico. Dedicar 15 minutos cada día entrenando tu mente con ejercicios prácticos te llevará más lejos que maratones agotadoras de fin de semana. ¡A darle al código!',
    languageId: 'python',
    codeSnippet: '# Consejo del día en Python\ndef avanzar_cada_dia(minutos=15):\n    return f"Consistencia de {minutos} min = Éxito asegurado 💻"\n\nprint(avanzar_cada_dia())',
    likes: 42,
    hasLiked: false,
    comments: [
      {
        id: 'c1',
        authorName: 'Lucía Santos',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucia',
        content: '¡Gran consejo Marc! Llevo 5 días seguidos con JavaScript y por fin entiendo los arrays.',
        createdAt: 'Hace 2 horas'
      },
      {
        id: 'c2',
        authorName: 'Mateo Gómez',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Mateo',
        content: 'La función de probar el código desde el móvil sin conexión me salva en el metro.',
        createdAt: 'Hace 45 minutos'
      }
    ],
    createdAt: 'Hace 3 horas'
  },
  {
    id: 'post-sarah-1',
    authorId: 'user-sarah',
    authorName: 'Sara Navarro',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sara',
    authorHandle: 'sara_code',
    content: '¡Acabo de desbloquear el logro "Semana Imparable"! 🔥 7 días seguidos practicando con Marc. Comparto mi solución al reto de filtrar números pares en JavaScript:',
    languageId: 'javascript',
    codeSnippet: 'const numeros = [1, 2, 3, 4, 5, 6];\nconst pares = numeros.filter(n => n % 2 === 0);\nconsole.log(pares); // [2, 4, 6]',
    achievementTitle: 'Semana Imparable (7 Días)',
    likes: 19,
    hasLiked: false,
    comments: [
      {
        id: 'c3',
        authorName: 'Marc',
        authorAvatar: '/src/assets/images/avatar_marc_mentor_1793881715962.jpg',
        content: '¡Enhorabuena Sara! Código limpio y directo al grano 👏',
        createdAt: 'Hace 1 hora'
      }
    ],
    createdAt: 'Hace 5 horas'
  },
  {
    id: 'post-diego-1',
    authorId: 'user-diego',
    authorName: 'Diego Ríos',
    authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Diego',
    authorHandle: 'diegodev',
    content: 'Empecé hoy con Rust desde cero. La seguridad de tipos al principio asusta, pero las explicaciones paso a paso de los ejercicios lo hacen súper accesible.',
    languageId: 'rust',
    codeSnippet: 'fn main() {\n    let lenguaje = "Rust";\n    println!("¡Aprendiendo {} con Marc!", lenguaje);\n}',
    likes: 11,
    hasLiked: false,
    comments: [],
    createdAt: 'Hace 8 horas'
  }
];

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'marc-mentor',
    name: 'Marc (Mentor)',
    handle: 'marc_tutor',
    avatarUrl: '/src/assets/images/avatar_marc_mentor_1793881715962.jpg',
    xp: 4850,
    streakDays: 45,
    rank: 1,
    isMarc: true,
    badge: 'Master Mentor'
  },
  {
    id: 'user-sara',
    name: 'Sara Navarro',
    handle: 'sara_code',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sara',
    xp: 2420,
    streakDays: 14,
    rank: 2,
    badge: 'Polyglot Dev'
  },
  {
    id: 'current-user',
    name: 'Tú (Estudiante)',
    handle: 'estudiante_marc',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Student',
    xp: 0,
    streakDays: 1,
    rank: 5,
    isCurrentUser: true,
    badge: 'Rookie Coder'
  },
  {
    id: 'user-diego',
    name: 'Diego Ríos',
    handle: 'diegodev',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Diego',
    xp: 590,
    streakDays: 3,
    rank: 4,
    badge: 'Explorer'
  },
  {
    id: 'user-lucia',
    name: 'Lucía Santos',
    handle: 'luciacodes',
    avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Lucia',
    xp: 430,
    streakDays: 2,
    rank: 5,
    badge: 'Explorer'
  }
];
