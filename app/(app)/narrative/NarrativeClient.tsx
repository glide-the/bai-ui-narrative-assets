"use client";

import { useEffect, useRef } from "react";
import { startApp } from "@/narrative/core/app";

export function NarrativeClient() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const runtime = startApp(el);
    return () => {
      runtime?.dispose();
    };
  }, []);

  return <div ref={ref} className="narrative-root" />;
}
