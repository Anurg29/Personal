import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Ensure remote API calls work on GitHub pages by providing the Render URL
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";
