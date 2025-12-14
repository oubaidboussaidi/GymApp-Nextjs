import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function simulateLatency() {
  const delay = Math.floor(Math.random() * 1000) + 200;
  await new Promise((resolve) => setTimeout(resolve, delay));
}
