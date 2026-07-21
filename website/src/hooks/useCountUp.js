import { useEffect, useState } from 'react';

/**
 * Animates a number from 0 to target when `active` becomes true.
 * @param {number} target
 * @param {boolean} active
 * @param {{ duration?: number }} options
 */
export function useCountUp(target, active, { duration = 1800 } = {}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let start = null;
    let frame;

    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, active, duration]);

  return value;
}
