import { useState, useRef, useCallback } from "react";

export function useDebounce<T>(initialValue: T, mililiSeconds: number = 350) {
  const [value, setValue] = useState<T>(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleValue = useCallback(
    (newValue: T) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setValue(newValue);
      }, mililiSeconds);
    },
    [mililiSeconds],
  );

  return { value, handleValue };
}
