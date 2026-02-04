import HomeLayout from "@/features/home/layout/home-layout";
import React, { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <HomeLayout>{children}</HomeLayout>
    </>
  );
}
