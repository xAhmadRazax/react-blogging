"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menubar } from "@/components/ui/menubar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarCustomTrigger } from "@/components/ui/sidebar-custon-trigger";
import { Spinner } from "@/components/ui/spinner";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { useUser } from "@/features/auth/hooks/use-user";
import { Button } from "@base-ui/react";
import {
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import { LogOut, Menu, NotebookPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HomeNavbar = () => {
  const { user, isLoading } = useUser();
  const { mutate, isLoading: isLoggingOut } = useLogout();
  if (isLoggingOut) {
    return <Spinner />;
  }
  console.log(user);
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
          <Menubar className="border-0">
            <MenubarMenu>
              <MenubarTrigger className="rounded full size-11 cursor-pointer">
                <Avatar className="border-2 rounded-full size-11">
                  <AvatarImage src={user.avatar as string} />
                  <AvatarFallback>{user.name} Avatar</AvatarFallback>
                </Avatar>
              </MenubarTrigger>

              <MenubarContent className="mr-2 mt-4 w-55 shadow-lg rounded-xl  border-2  ">
                <MenubarGroup className="space-y-3">
                  <MenubarItem className="px-4 py-2 rounded-t-xl">
                    <Link href={"/profile"} className="flex gap-5">
                      <Avatar className="border-2 rounded-full size-11">
                        <AvatarImage src={user.avatar as string} />
                      </Avatar>
                      <div className="line-clamp-1 w-full mt-1 space-y-0.5  text-neutral-500 hover:text-neutral-800">
                        <div className="text-sm ">{user.name}</div>
                        <div className="text-[10px]">View profile</div>
                      </div>
                    </Link>
                  </MenubarItem>

                  <MenubarItem className="px-4 py-2  text-neutral-500 hover:text-neutral-800">
                    <Link href={"/studio"} className="flex gap-4 items-center">
                      <span>
                        <NotebookPen className="size-4" />
                      </span>
                      Studio
                    </Link>
                  </MenubarItem>

                  <MenubarItem className="px-4 py-2  text-neutral-500 hover:text-neutral-800 rounded-b-xl">
                    <Button
                      onClick={() => mutate()}
                      className="flex gap-4 items-center"
                    >
                      <span>
                        <LogOut className="size-4" />
                      </span>
                      Logout
                    </Button>
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        )}
      </div>
    </header>
  );
};

export default HomeNavbar;
