"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/tailgrids/core/button";

type BallType = "none" | "basketball" | "football" | "volleyball" | "human";

const BALL_CONFIGS: Record<
  BallType,
  { name: string; keyHint: string; image: string | null }
> = {
  none: {
    name: "None",
    keyHint: "0",
    image: null,
  },
  basketball: {
    name: "Basketball",
    keyHint: "1",
    image: "/animation/Basketball.webp",
  },
  football: {
    name: "Football",
    keyHint: "2",
    image: "/animation/Football.png",
  },
  volleyball: {
    name: "Volleyball",
    keyHint: "3",
    image: "/animation/Volleyball.webp",
  },
  human: {
    name: "Human",
    keyHint: "4",
    image: "/animation/me.jpeg",
  },
};

export default function AnimationPage() {
  const fieldWidth = 640;
  const fieldHeight = 480;
  const ballRadius = 50;
  const ballDiameter = ballRadius * 2;
  const maxX = fieldWidth - ballDiameter - 4;
  const maxY = fieldHeight - ballDiameter - 4;

  const [ballType, setBallType] = useState<BallType>("none");
  const [running, setRunning] = useState<boolean>(true);
  const [velocity] = useState<number>(500);

  // Position state for rendering
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: maxX,
    y: maxY,
  });

  // Physics state kept in ref for silky smooth requestAnimationFrame
  const physicsRef = useRef({
    x: maxX,
    y: maxY,
    dirX: 1, // 1: moving right, -1: moving left
    dirY: 1, // 1: moving down, -1: moving up
    running: true,
    velocity: 500,
    lastTime: 0,
  });

  // Auto-play animation whenever arriving at this page
  useEffect(() => {
    physicsRef.current.running = true;
    physicsRef.current.lastTime = performance.now();
  }, []);

  // Keep ref synchronized with state
  useEffect(() => {
    physicsRef.current.running = running;
    if (running) {
      physicsRef.current.lastTime = performance.now();
    }
  }, [running]);

  useEffect(() => {
    physicsRef.current.velocity = velocity;
  }, [velocity]);

  // Animation frame loop
  useEffect(() => {
    let animId: number;

    const tick = (time: number) => {
      const p = physicsRef.current;
      if (p.running) {
        if (p.lastTime === 0) p.lastTime = time;
        const dt = Math.min((time - p.lastTime) / 1000, 0.1); // clamp dt to avoid huge jumps
        p.lastTime = time;

        const vx = Math.round(p.velocity / Math.SQRT2);
        const vy = Math.round(p.velocity / Math.SQRT2);

        // Update X
        let nextX = p.x + p.dirX * vx * dt;
        if (nextX >= maxX) {
          nextX = maxX - (nextX - maxX);
          p.dirX = -1;
        } else if (nextX <= 0) {
          nextX = -nextX;
          p.dirX = 1;
        }
        p.x = Math.max(0, Math.min(maxX, nextX));

        // Update Y
        let nextY = p.y + p.dirY * vy * dt;
        if (nextY >= maxY) {
          nextY = maxY - (nextY - maxY);
          p.dirY = -1;
        } else if (nextY <= 0) {
          nextY = -nextY;
          p.dirY = 1;
        }
        p.y = Math.max(0, Math.min(maxY, nextY));

        setPosition({ x: p.x, y: p.y });
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [maxX, maxY]);

  // Keyboard controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Avoid triggering when user is in input/textarea
    if (
      document.activeElement?.tagName === "INPUT" ||
      document.activeElement?.tagName === "TEXTAREA"
    ) {
      return;
    }

    if (e.code === "Space" || e.key === " ") {
      e.preventDefault();
      setRunning((prev) => !prev);
    } else if (e.key === "0") {
      setBallType("none");
    } else if (e.key === "1") {
      setBallType("basketball");
    } else if (e.key === "2") {
      setBallType("football");
    } else if (e.key === "3") {
      setBallType("volleyball");
    } else if (e.key === "4") {
      setBallType("human");
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const activeBall = BALL_CONFIGS[ballType];

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      {/* Title & Student Info */}
      <div className="text-center mb-5">
        <h1 className="text-3xl font-extrabold tracking-wider text-neutral-900 mb-1">
          ANIMATION
        </h1>
      </div>

      {/* Animation Field Container */}
      <div
        className="relative shadow-xl rounded-2xl overflow-hidden border-2 border-neutral-900 bg-neutral-100 select-none"
        style={{
          width: `${fieldWidth}px`,
          maxWidth: "100%",
          height: `${fieldHeight}px`,
          backgroundImage:
            "url('/animation/wood-field.jpg'), url('/animation/Wood%20field.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Ball */}
        <div
          className="absolute rounded-full border-2 border-neutral-900 shadow-md transition-[background-image] duration-150"
          style={{
            width: `${ballDiameter}px`,
            height: `${ballDiameter}px`,
            backgroundColor: ballType === "none" ? "lightblue" : "transparent",
            backgroundImage: activeBall.image
              ? `url('${activeBall.image}')`
              : "none",
            backgroundPosition: "center",
            backgroundSize: "cover",
            left: `${position.x}px`,
            top: `${position.y}px`,
            willChange: "left, top",
          }}
        />
      </div>

      {/* Control Panel */}
      <div
        className="mt-4 flex flex-col gap-3 w-full"
        style={{ width: `${fieldWidth}px`, maxWidth: "100%" }}
      >
        {/* Main Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
          {/* Play/Pause Button */}
          <Button
            variant={running ? "danger" : "success"}
            appearance="fill"
            size="md"
            onClick={(e) => {
              (e.currentTarget as HTMLButtonElement)?.blur();
              setRunning((prev) => !prev);
            }}
            className="min-w-28 font-bold"
          >
            {running ? (
              <span className="flex items-center gap-1.5">
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
                Pause
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <svg className="size-4 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Play
              </span>
            )}
          </Button>

          {/* Ball Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {(Object.keys(BALL_CONFIGS) as BallType[]).map((type) => {
              const item = BALL_CONFIGS[type];
              const isSelected = ballType === type;
              return (
                <Button
                  key={type}
                  variant="primary"
                  appearance={isSelected ? "fill" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    (e.currentTarget as HTMLButtonElement)?.blur();
                    setBallType(type);
                  }}
                  className={`capitalize transition-all text-xs ${
                    isSelected ? "shadow-xs font-bold" : ""
                  }`}
                >
                  {item.name}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
