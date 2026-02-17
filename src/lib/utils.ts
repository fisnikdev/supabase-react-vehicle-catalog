import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getHighResImage = (url: string) => {
  if (!url) return "/placeholder.png";

  return url.replace('http:', 'https:').split('?')[0];
};