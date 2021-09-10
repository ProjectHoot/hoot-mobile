import { useMemo } from "react";

export default function useElapsedTime(time: string): string {
  return useMemo(() => calculateElapsedTime(time), [time]);
}

export function calculateElapsedTime(time: string): string {
  const seconds = Math.round((Date.now() - Date.parse(time)) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const weeks = Math.round(days / 7);
  const displayTime =
    (minutes < 60 && `${minutes}m`) ||
    (hours < 24 && `${hours}h`) ||
    (days < 7 && `${days}d`) ||
    `${weeks}w`;
  return displayTime;
}
