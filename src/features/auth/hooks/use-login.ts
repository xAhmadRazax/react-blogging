"use client";

import { login } from "@/lib/services/frontend/auth.service";
import { LoginSchema } from "@/lib/zodSchemas/auth.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const {
    mutate,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: (data: LoginSchema) => login(data),
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);

      queryClient.invalidateQueries({ queryKey: ["user"] });

      router.replace("/");
    },
    onError: (err) => {
      console.log(error);
    },
  });

  return { mutate, isLoading, error };
}
