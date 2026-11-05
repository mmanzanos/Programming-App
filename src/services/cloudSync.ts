import { storage } from './storage';
import { PendingSyncItem } from '../types';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error';

class CloudSyncService {
  private listeners: ((status: SyncStatus, pendingCount: number) => void)[] = [];
  private currentStatus: SyncStatus = 'idle';

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.syncPendingData();
      });
      window.addEventListener('offline', () => {
        this.setStatus('offline');
      });
    }
  }

  public subscribe(fn: (status: SyncStatus, pendingCount: number) => void) {
    this.listeners.push(fn);
    fn(this.currentStatus, this.getPendingCount());
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    const count = this.getPendingCount();
    this.listeners.forEach(fn => fn(this.currentStatus, count));
  }

  private setStatus(status: SyncStatus) {
    this.currentStatus = status;
    this.notify();
  }

  public getPendingCount(): number {
    return storage.getPendingSyncQueue().length;
  }

  public async syncPendingData(): Promise<{ success: boolean; syncedItemsCount: number }> {
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      this.setStatus('offline');
      return { success: false, syncedItemsCount: 0 };
    }

    const queue: PendingSyncItem[] = storage.getPendingSyncQueue();
    if (queue.length === 0) {
      this.setStatus('synced');
      storage.setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return { success: true, syncedItemsCount: 0 };
    }

    this.setStatus('syncing');

    try {
      // Simulate network latency for cloud sync reconciliation
      await new Promise(resolve => setTimeout(resolve, 800));

      // Reconcile pending items:
      // Mark any social posts that had pendingSync as fully synced
      const posts = storage.getSocialPosts();
      let postsUpdated = false;
      const updatedPosts = posts.map(p => {
        if (p.pendingSync) {
          postsUpdated = true;
          return { ...p, pendingSync: false };
        }
        return p;
      });
      if (postsUpdated) {
        storage.saveSocialPosts(updatedPosts);
      }

      const count = queue.length;
      storage.clearPendingSyncQueue();
      storage.setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      this.setStatus('synced');

      setTimeout(() => {
        if (this.currentStatus === 'synced') {
          this.setStatus('idle');
        }
      }, 3000);

      return { success: true, syncedItemsCount: count };
    } catch (err) {
      this.setStatus('error');
      return { success: false, syncedItemsCount: 0 };
    }
  }
}

export const cloudSync = new CloudSyncService();
