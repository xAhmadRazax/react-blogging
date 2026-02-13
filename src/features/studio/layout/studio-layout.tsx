export const dynamic = "force-dynamic";
export const revalidate = 0;
import { SidebarProvider } from "@/components/ui/sidebar";
import React, { ReactNode } from "react";
import { getMe } from "@/lib/services/frontend/auth.service";
import StudioNavbar from "../components/studio-navbar";
import HomeSidebar from "@/features/home/components/home-sidebar";

const StudioLayout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getMe();
  return (
    <div className="font-lory">
      <SidebarProvider>
        <div className="w-full grid md:grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
          <StudioNavbar user={user} />
          {/* <HomeNavbar /> */}
          <HomeSidebar />
          <main className="w-full">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default StudioLayout;
