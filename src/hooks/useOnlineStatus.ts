import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [realOnline, setRealOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setRealOnline(true);
    const handleOffline = () => setRealOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOnline = realOnline && !simulatedOffline;

  const toggleSimulatedOffline = () => {
    setSimulatedOffline(prev => !prev);
  };

  return {
    isOnline,
    realOnline,
    simulatedOffline,
    toggleSimulatedOffline
  };
}
