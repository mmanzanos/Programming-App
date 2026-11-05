import React, { useState, useEffect } from 'react';
import { cloudSync, SyncStatus } from '../services/cloudSync';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
  simulatedOffline: boolean;
  onToggleSimulateOffline: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  isOnline,
  simulatedOffline,
  onToggleSimulateOffline
}) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const unsubscribe = cloudSync.subscribe((status, count) => {
      setSyncStatus(status);
      setPendingCount(count);
    });
    return unsubscribe;
  }, []);

  const handleManualSync = async () => {
    await cloudSync.syncPendingData();
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      {/* Network Connectivity Badge */}
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors ${
          !isOnline
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
        }`}
      >
        {!isOnline ? (
          <>
            <WifiOff className="w-3 h-3 animate-pulse" />
            <span>Sin Conexión (Offline)</span>
          </>
        ) : (
          <>
            <Wifi className="w-3 h-3 text-emerald-500" />
            <span className="hidden sm:inline">En Línea</span>
          </>
        )}
      </div>

      {/* Cloud Sync State */}
      {pendingCount > 0 ? (
        <button
          onClick={handleManualSync}
          disabled={!isOnline || syncStatus === 'syncing'}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition-colors"
          title="Cambios guardados localmente listos para sincronizar en la nube"
        >
          <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin text-indigo-500' : ''}`} />
          <span>{pendingCount} {pendingCount === 1 ? 'cambio pendiente' : 'cambios pendientes'}</span>
          {isOnline && <span className="underline ml-0.5 font-bold">Sincronizar</span>}
        </button>
      ) : syncStatus === 'synced' ? (
        <div className="hidden md:flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-3 h-3" />
          <span>Nube sincronizada</span>
        </div>
      ) : null}

      {/* Quick offline test switch */}
      <button
        onClick={onToggleSimulateOffline}
        className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${
          simulatedOffline
            ? 'border-amber-400 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200'
            : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        title="Activa o desactiva la simulación de corte de internet para probar el funcionamiento offline"
      >
        {simulatedOffline ? 'Reconectar Red' : 'Probar Modo Offline'}
      </button>
    </div>
  );
};
