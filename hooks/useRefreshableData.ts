import { useState, useEffect } from "react";

export function useRefreshableData<T>(
  effect: (stopLoading: () => void) => void | (() => void | undefined),
  deps?: any[],
): [boolean, () => void] {
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    effect(() => setIsLoading(false));
  }, [refreshCount, ...(deps !== undefined ? deps : [])]);

  function refresh() {
    setRefreshCount(c => c + 1);
    setIsLoading(true);
  }

  return [isLoading, refresh];
}
