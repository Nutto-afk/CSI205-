'use client';

import { useEffect, useState } from "react";
import { Button } from "./tailgrids/core/button";

interface CounterProps {
  name?: string;
  initCount?: number;
  stepsize?: number;
  limit?: number;
}

export default function Counter({
  name = "Counter",
  initCount = 0,
  stepsize = 1,
  limit = 10,
}: CounterProps) {
  const [count, setCount] = useState<number>(initCount);

  useEffect(() => {
    if (count >= limit) {
      alert("OVER LIMIT");
    }
  }, [count, limit]);

  useEffect(() => {
    setCount(initCount);
  }, [initCount]);

  return (
    <div className="text-center border-2 border-neutral-900 mx-auto p-6 rounded-2xl bg-white shadow-md max-w-sm w-full">
      <h2 className="text-xl font-bold text-neutral-800 mb-4">
        {name} &nbsp;
        <span className="text-sm font-semibold text-neutral-500">
          S:{stepsize} L:{limit}
        </span>
      </h2>
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="danger"
          size="md"
          className="size-12 rounded-full font-bold text-xl shadow-xs"
          onClick={() => setCount((c) => c - stepsize)}
        >
          -
        </Button>
        <span
          className={`text-4xl font-extrabold w-20 select-none ${
            count >= limit ? "text-red-500" : "text-neutral-900"
          }`}
        >
          {count}
        </span>
        <Button
          variant="success"
          size="md"
          className="size-12 rounded-full font-bold text-xl shadow-xs"
          onClick={() => setCount((c) => c + stepsize)}
        >
          +
        </Button>
      </div>
    </div>
  );
}
