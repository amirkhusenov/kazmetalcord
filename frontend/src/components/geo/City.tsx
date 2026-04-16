"use client";
import { useGlobalStore } from "@/hooks/useGlobalStore";

export function City() {
  const city = useGlobalStore((state) => state.city);
  return city;
}
