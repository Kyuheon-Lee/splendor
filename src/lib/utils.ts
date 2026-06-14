import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * tailwind-merge와 clsx를 결합하여 조건부 클래스를 깔끔하게 관리합니다.
 * 클래스 중복이나 충돌을 자동으로 해결해줍니다.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
