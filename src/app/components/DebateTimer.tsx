import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface DebateTimerProps {
  startedAt: number;
  duration: number; // in minutes
  onTimeUp?: () => void;
}

export function DebateTimer({ startedAt, duration, onTimeUp }: DebateTimerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endTime = startedAt + duration * 60 * 1000;
      const now = Date.now();
      const diff = endTime - now;
      return Math.max(0, diff);
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft === 0 && onTimeUp) {
        onTimeUp();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startedAt, duration, onTimeUp]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft < 5 * 60 * 1000; // Less than 5 minutes
  const isVeryLowTime = timeLeft < 1 * 60 * 1000; // Less than 1 minute

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-[12px] transition-all duration-300 ${
        isVeryLowTime
          ? "bg-red-500/20 text-red-500 animate-pulse"
          : isLowTime
          ? "bg-yellow-500/20 text-yellow-600 dark:text-yellow-500"
          : "bg-secondary"
      }`}
    >
      <Clock className="w-4 h-4" />
      <span className="text-[14px] font-medium tabular-nums">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
