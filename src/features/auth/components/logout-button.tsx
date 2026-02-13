import React from "react";
import { LogOut } from "lucide-react";
import { Button } from "@base-ui/react";
import { useLogout } from "../hooks/use-logout";

const LogoutButton = () => {
  const { mutate } = useLogout();
  return (
    <Button
      onClick={() => mutate()}
      className="flex gap-4 items-center cursor-pointer  w-full"
    >
      <span>
        <LogOut className="size-4" />
      </span>
      Logout
    </Button>
  );
};

export default LogoutButton;
