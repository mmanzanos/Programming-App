import { UserProfile, Achievement, SocialPost, PendingSyncItem, LanguageId } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_POSTS } from '../data/initialSocial';

const STORAGE_KEYS = {
  USER_PROFILE: 'codemarc_user_profile',
  ACTIVE_USER_ID: 'codemarc_active_user_id',
  ALL_USERS: 'codemarc_all_users',
  USER_PROFILE_PREFIX: 'codemarc_user_profile_',
  ACHIEVEMENTS_PREFIX: 'codemarc_achievements_',
  ACHIEVEMENTS: 'codemarc_achievements',
  SOCIAL_POSTS: 'codemarc_social_posts',
  PENDING_SYNC: 'codemarc_pending_sync',
  THEME: 'codemarc_theme',
  LAST_SYNC_TIME: 'codemarc_last_sync_time'
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'current-user',
  name: '',
  firstName: '',
  lastName: '',
  isRegistered: false,
  handle: '',
  avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=MarcDev',
  bio: 'Aprendiendo a programar con Marc desde cero. ¡En camino a fullstack!',
  level: 1,
  xp: 0,
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedExerciseIds: [],
  solvedCodeMap: {},
  notificationSettings: {
    enabled: true,
    reminderTime: '20:00',
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    soundEnabled: true
  }
};

export class StorageService {
  /**
   * Returns list of all registered users saved on this device.
   */
  public getAllUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALL_USERS);
      if (data) {
        const users: UserProfile[] = JSON.parse(data);
        if (Array.isArray(users) && users.length > 0) {
          return users;
        }
      }
    } catch (e) {
      console.warn('Error reading all users from localStorage', e);
    }

    // Migration fallback: check if single user profile exists
    try {
      const single = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (single) {
        const parsed: UserProfile = JSON.parse(single);
        if (parsed.name && parsed.name.trim()) {
          const list = [parsed];
          localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(list));
          return list;
        }
      }
    } catch {}

    return [];
  }

  /**
   * Get active user id
   */
  public getActiveUserId(): string {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID) || 'current-user';
  }

  /**
   * Set active user id
   */
  public setActiveUserId(userId: string): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
  }

  /**
   * Get user profile by userId or active user
   */
  public getUserProfile(userId?: string): UserProfile {
    const targetId = userId || this.getActiveUserId();

    // 1. Try to fetch from specific user key
    try {
      const specificData = localStorage.getItem(STORAGE_KEYS.USER_PROFILE_PREFIX + targetId);
      if (specificData) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(specificData) };
      }
    } catch (e) {
      console.warn(`Error reading profile for ${targetId}`, e);
    }

    // 2. Try to fetch from all users list
    const allUsers = this.getAllUsers();
    const found = allUsers.find(u => u.id === targetId);
    if (found) {
      return { ...DEFAULT_PROFILE, ...found };
    }

    // 3. Fallback to general user profile key
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Error reading default user profile', e);
    }

    return DEFAULT_PROFILE;
  }

  /**
   * Save user profile. Updates active profile and the all-users list.
   */
  public saveUserProfile(profile: UserProfile): void {
    try {
      // Save specific user profile
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE_PREFIX + profile.id, JSON.stringify(profile));
      // Save active user pointer and default
      localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, profile.id);
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));

      // Update all users list
      const users = this.getAllUsers();
      const existingIdx = users.findIndex(u => u.id === profile.id);
      let updatedUsers: UserProfile[];
      if (existingIdx >= 0) {
        updatedUsers = [...users];
        updatedUsers[existingIdx] = profile;
      } else {
        updatedUsers = [...users, profile];
      }
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(updatedUsers));
    } catch (e) {
      console.error('Error saving user profile', e);
    }
  }

  /**
   * Create a new unique user profile
   */
  public createNewUser(firstName: string, lastName: string, avatarUrl: string, handle: string): UserProfile {
    const cleanFirst = firstName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanLast = lastName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const uniqueId = `usr_${cleanFirst}_${cleanLast}_${Date.now().toString(36)}`;

    const newProfile: UserProfile = {
      ...DEFAULT_PROFILE,
      id: uniqueId,
      name: `${firstName} ${lastName}`.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      isRegistered: true,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatarUrl,
      level: 1,
      xp: 0,
      streakDays: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedExerciseIds: [],
      solvedCodeMap: {}
    };

    this.saveUserProfile(newProfile);
    this.saveAchievements(INITIAL_ACHIEVEMENTS, newProfile.id);
    return newProfile;
  }

  /**
   * Switch the active user
   */
  public switchUser(userId: string): UserProfile {
    this.setActiveUserId(userId);
    const profile = this.getUserProfile(userId);
    // Also sync the generic key
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    return profile;
  }

  /**
   * Delete a user profile
   */
  public deleteUser(userId: string): UserProfile[] {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE_PREFIX + userId);
      localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS_PREFIX + userId);

      const users = this.getAllUsers().filter(u => u.id !== userId);
      localStorage.setItem(STORAGE_KEYS.ALL_USERS, JSON.stringify(users));

      if (this.getActiveUserId() === userId) {
        if (users.length > 0) {
          this.switchUser(users[0].id);
        } else {
          this.setActiveUserId('current-user');
          localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
        }
      }
      return users;
    } catch (e) {
      console.error('Error deleting user', e);
      return this.getAllUsers();
    }
  }

  /**
   * Reset the progress of a specific language from scratch (0/30) for a user
   */
  public resetLanguageProgress(userId: string, languageId: LanguageId): UserProfile {
    const profile = this.getUserProfile(userId);

    // Filter out completed exercise IDs that start with this language
    const prefix = `${languageId}-`;
    const updatedCompletedIds = profile.completedExerciseIds.filter(id => !id.startsWith(prefix));

    // Remove solved code for this language
    const updatedSolvedCodeMap: Record<string, string> = {};
    for (const [key, val] of Object.entries(profile.solvedCodeMap || {})) {
      if (!key.startsWith(prefix)) {
        updatedSolvedCodeMap[key] = val;
      }
    }

    const updatedProfile: UserProfile = {
      ...profile,
      completedExerciseIds: updatedCompletedIds,
      solvedCodeMap: updatedSolvedCodeMap
    };

    this.saveUserProfile(updatedProfile);
    return updatedProfile;
  }

  public getAchievements(userId?: string): Achievement[] {
    const targetId = userId || this.getActiveUserId();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS_PREFIX + targetId) ||
                   localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (data) {
        const parsed: Achievement[] = JSON.parse(data);
        const profile = this.getUserProfile(targetId);
        // If user has not completed any exercises yet, don't allow premature unlocks
        if (profile.completedExerciseIds.length === 0) {
          return INITIAL_ACHIEVEMENTS;
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Error reading achievements', e);
    }
    return INITIAL_ACHIEVEMENTS;
  }

  public saveAchievements(achievements: Achievement[], userId?: string): void {
    const targetId = userId || this.getActiveUserId();
    try {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS_PREFIX + targetId, JSON.stringify(achievements));
      if (targetId === this.getActiveUserId()) {
        localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      }
    } catch (e) {
      console.error('Error saving achievements', e);
    }
  }

  public getSocialPosts(): SocialPost[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SOCIAL_POSTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading social posts', e);
    }
    return INITIAL_POSTS;
  }

  public saveSocialPosts(posts: SocialPost[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SOCIAL_POSTS, JSON.stringify(posts));
    } catch (e) {
      console.error('Error saving social posts', e);
    }
  }

  public getPendingSyncQueue(): PendingSyncItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Error reading pending sync', e);
    }
    return [];
  }

  public enqueueSync(item: Omit<PendingSyncItem, 'id' | 'timestamp'>): void {
    const queue = this.getPendingSyncQueue();
    const newItem: PendingSyncItem = {
      ...item,
      id: 'sync_' + Math.random().toString(36).substring(2, 9),
      timestamp: Date.now()
    };
    queue.push(newItem);
    try {
      localStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(queue));
    } catch (e) {
      console.error('Error enqueuing sync item', e);
    }
  }

  public clearPendingSyncQueue(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);
    } catch (e) {
      console.error('Error clearing sync queue', e);
    }
  }

  public getLastSyncTime(): string {
    return localStorage.getItem(STORAGE_KEYS.LAST_SYNC_TIME) || 'Sincronizado recientemente';
  }

  public setLastSyncTime(timeStr: string): void {
    localStorage.setItem(STORAGE_KEYS.LAST_SYNC_TIME, timeStr);
  }

  public getTheme(): 'dark' | 'light' {
    const theme = localStorage.getItem(STORAGE_KEYS.THEME);
    if (theme === 'dark' || theme === 'light') return theme;
    return 'dark'; // Default to modern developer dark mode for study sessions
  }

  public setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }
}

export const storage = new StorageService();
