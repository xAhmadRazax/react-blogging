import {
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@radix-ui/react-menubar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menubar } from "@/components/ui/menubar";
import Link from "next/link";
import LogoutButton from "@/features/auth/components/logout-button";
import { Bell, NotebookPen, SquarePen } from "lucide-react";
import { User } from "@/lib/types/user.type";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const UserNav = ({ user }: { user: User }) => {
  const router = useRouter();
  return (
    <div className="flex gap-5">
      <Button
        onClick={() => router.push("/studio")}
        type="button"
        variant="ghost"
        className="cursor-pointer text-neutral-500 font-normal"
      >
        <span>
          <SquarePen className="size-5" />
        </span>
        <span>Write</span>
      </Button>

      <Button
        type="button"
        variant="ghost"
        className="cursor-pointer text-neutral-500 font-normal"
      >
        <Bell className="size-5" />
      </Button>

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
                <Link href={`@${user.name}/profile`} className="flex gap-5">
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
                <LogoutButton />
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default UserNav;
