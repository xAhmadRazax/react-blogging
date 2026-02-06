// src/hooks/useUser.ts
import { userSelectSchema } from "@/lib/db/schema";
import { getMe } from "@/lib/services/frontend/auth.service";
import { User } from "@/lib/types/user.type";
import { getAccessToken } from "@/lib/utils/axios.util";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const {
    data: user,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return { user: user as User, isLoading };
}
