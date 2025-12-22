import { AppShell } from "@/components/app-shell";
import { Slot, usePathname } from "expo-router";
import React from "react";

function getTitle(pathname: string) {
  if (pathname === "/" || pathname === "/(tabs)" || pathname === "/(tabs)/")
    return "Pecan";
  if (pathname === "/button1" || pathname === "/(tabs)/button1")
    return "Button 1";
  if (pathname === "/wallet" || pathname === "/(tabs)/wallet") return "Wallet";
  if (pathname === "/settings" || pathname === "/(tabs)/settings")
    return "Settings";
  if (pathname === "/profile" || pathname === "/(tabs)/profile")
    return "Profile";
  return "Pecan";
}

export default function TabLayout() {
  const pathname = usePathname();
  const title = getTitle(pathname ?? "/(tabs)");

  return (
    <AppShell title={title}>
      <Slot />
    </AppShell>
  );
}
