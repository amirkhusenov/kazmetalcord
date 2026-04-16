"use client";
import { useGlobalStore } from "@/hooks/useGlobalStore";
import { getAddressFromCity } from "@/lib/utils";

export function Address() {
  const city = useGlobalStore((state) => state.city);
  return getAddressFromCity(city);
}
