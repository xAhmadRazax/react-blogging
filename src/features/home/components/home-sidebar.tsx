import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import React from "react";

const HomeSidebar = () => {
  return (
    <aside className="w-full ">
      <Sidebar className="" collapsible="icon" variant="sidebar">
        <SidebarContent className="bg-white">hello</SidebarContent>
      </Sidebar>
    </aside>
  );
};

export default HomeSidebar;
