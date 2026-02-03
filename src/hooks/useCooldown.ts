import { useEffect, useState } from "react";

export const useCooldown = (
  key: string,
  duration: number // seconds
) => {
  const [remaining, setRemaining] = useState<number>(() => {
    const stored = localStorage.getItem(key);
    if (!stored) return 0;

    const diff = Math.floor((Number(stored) - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  });

  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(key);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  const start = () => {
    const expiresAt = Date.now() + duration * 1000;
    localStorage.setItem(key, expiresAt.toString());
    setRemaining(duration);
  };

  return {
    remaining,
    start,
    isActive: remaining > 0,
  };
};
