"use client";

import { logout } from "@/lib/services/frontend/auth.service";
import { setAccessToken } from "@/lib/utils/axios.util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    mutate,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      //   queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.clear();
      //   queryClient.invalidateQueries({ exact: true });
      setAccessToken(null);

      //   router.replace("/");
    },
    onError: (err) => {
      console.log(error);
    },
  });

  return { mutate, isLoading, error };
}
