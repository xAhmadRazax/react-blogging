import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const Container = ({
  children,
  classNames,
}: {
  children: ReactNode;
  classNames: string;
}) => {
  return (
    <div className={cn("mx-auto px-4 w-fit max-w-3xl", classNames)}>
      {children}
    </div>
  );
};
