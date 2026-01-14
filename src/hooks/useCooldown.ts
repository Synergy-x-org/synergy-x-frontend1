import { useEffect, useState } from "react";

export function useCooldown(seconds: number) {
  const [timeLeft, setTimeLeft] = useState(0);

  const start = () => setTimeLeft(seconds);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [timeLeft]);

  return {
    timeLeft,
    isCoolingDown: timeLeft > 0,
    start,
  };
}
