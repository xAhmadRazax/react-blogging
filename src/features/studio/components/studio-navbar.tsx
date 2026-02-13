"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/lib/types/user.type";
import { Menu, NotebookPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import UserNav from "@/features/home/components/user-nav";

const StudioNavbar = ({ user }: { user: User | null }) => {
  return (
    <header className=" flex justify-between h-full  col-span-full px-4 py-2  row-start-1 row-end z-20 shadow ">
      <div className="flex items-center gap-3 md:gap-5">
        <SidebarTrigger
          triggerIcon={<Menu className="size-5" />}
          className="text-neutral-500"
        />

        <Image
          className="w-24 sm:w-28  md:w-36 h-auto"
          src={"./React-Blogging-l.svg"}
          alt="React Blogging Icon"
          width={144}
          height={53}
        />
      </div>
      {/* <SidebarCustomTrigger /> */}

      {/* user profile */}

      <div className="flex gap-3 md:gap-5 h-auto items-center">
        {!user ? (
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
          <UserNav user={user} />
        )}
      </div>
    </header>
  );
};

export default StudioNavbar;
