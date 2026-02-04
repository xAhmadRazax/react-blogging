import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import HomeNavbar from "../components/home-navbar";
import HomeSidebar from "../components/home-sidebar";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      <SidebarProvider>
        <div className="w-full grid md:grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
          <HomeNavbar />
          <HomeSidebar />
          <main className="w-full">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default HomeLayout;
