import { useEffect, useRef, useState } from "react";

function useCounter(target: number, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / durationMs);
      setValue(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, durationMs]);
  return value;
}

export default function Stats() {
  const universities = useCounter(25);
  const students = useCounter(1200);
  const countries = useCounter(8);
  return (
    <div className="grid sm:grid-cols-3 gap-6">
      <div className="text-center glass rounded-xl p-6">
        <div className="text-3xl font-bold text-royalBlue">{universities}+</div>
        <div className="text-sm text-slate-600 mt-1">Partner Universities</div>
      </div>
      <div className="text-center glass rounded-xl p-6">
        <div className="text-3xl font-bold text-royalBlue">{students}+</div>
        <div className="text-sm text-slate-600 mt-1">Happy Students</div>
      </div>
      <div className="text-center glass rounded-xl p-6">
        <div className="text-3xl font-bold text-royalBlue">{countries}</div>
        <div className="text-sm text-slate-600 mt-1">Countries</div>
      </div>
    </div>
  );
}

