import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

export function getLevelFromXP(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getXPForNextLevel(level: number): number {
  return level * 100;
}

export function getXPProgress(xp: number): { current: number; needed: number; percent: number } {
  const level = getLevelFromXP(xp);
  const xpForCurrentLevel = (level - 1) * 100;
  const current = xp - xpForCurrentLevel;
  const needed = 100;
  return { current, needed, percent: Math.min((current / needed) * 100, 100) };
}
