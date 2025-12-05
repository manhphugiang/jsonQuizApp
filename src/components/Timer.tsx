import { useEffect } from 'react';

interface TimerProps {
  duration: number;
  onExpire: () => void;
  onTick: (newTime: number) => void;
}

/**
 * Component for displaying countdown timer in test mode
 * Requirements: 5.1, 5.5
 */
export function Timer({ duration, onExpire, onTick }: TimerProps) {
  useEffect(() => {
    if (duration <= 0) {
      onExpire();
      return;
    }

    const interval = setInterval(() => {
      const newTime = duration - 1;
      onTick(newTime);
      
      if (newTime <= 0) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, onExpire, onTick]);

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;

  const isLowTime = duration < 60;
  const isCritical = duration < 30;

  return (
    <div
      className={`px-4 py-2 rounded-lg font-mono text-lg font-bold ${
        isCritical
          ? 'bg-red-100 text-red-700 border-2 border-red-300'
          : isLowTime
          ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
          : 'bg-blue-100 text-blue-700 border-2 border-blue-300'
      }`}
    >
      ⏱ {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}
