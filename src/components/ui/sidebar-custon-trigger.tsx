"use client";
import { useSidebar } from "./sidebar";

export function SidebarCustomTrigger() {
  const { toggleSidebar } = useSidebar();

  return <button onClick={toggleSidebar}>Toggle Sidebar</button>;
}
