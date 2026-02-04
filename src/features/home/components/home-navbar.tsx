import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarCustomTrigger } from "@/components/ui/sidebar-custon-trigger";
import { Button } from "@base-ui/react";
import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomeNavbar = () => {
  let auth = null;
  return (
    <header className=" flex justify-between h-full  col-span-full px-4 py-3  row-start-1 row-end z-20 shadow ">
      <div className="flex items-center gap-3 md:gap-5">
        <SidebarTrigger triggerIcon={<Menu />} />

        <Image
          className="w-24 sm:w-28  md:w-36 h-auto"
          src={"./React-Blogging-l.svg"}
          alt="React Blogging Icon"
          width={200}
          height={200}
        />
      </div>
      {/* <SidebarCustomTrigger /> */}

      {/* user profile */}

      <div className="flex gap-3 md:gap-5 h-auto items-center">
        {!auth ? (
          <>
            <Link href="/login" className="text-sm md:text-base">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-neutral-800 text-neutral-200 rounded-3xl  px-2  md:px-4 py-2 block text-sm md:text-base  "
            >
              Get Started
            </Link>
          </>
        ) : (
          "user"
        )}
      </div>
    </header>
  );
};

export default HomeNavbar;
