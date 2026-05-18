import type { Metadata } from "next";
import "./styles/base.css";
import "./styles/theme.css";
import "./styles/layout.css";
import "./styles/components.css";

export const metadata: Metadata = {
  title: "洱海边的三重回声 · 叙事",
  description: "从白族文化到现代文明的视觉叙事（SUO-103）",
};

export default function NarrativeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
