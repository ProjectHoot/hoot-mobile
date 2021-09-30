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
  const months = Math.round(days / 30.4);
  const years = Math.round(days / 365);
  const displayTime =
    (minutes < 60 && `${minutes}min`) ||
    (hours < 24 && `${hours}h`) ||
    (days < 7 && `${days}d`) ||
    (weeks < 5 && `${weeks}w`) ||
    (months < 12 && `${months}mo`) ||
    `${years}y`;
  return displayTime;
}
