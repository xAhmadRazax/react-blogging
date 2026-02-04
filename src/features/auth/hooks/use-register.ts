"use client";

import { register } from "@/lib/services/frontend/auth.service";
import { RegisterSchema } from "@/lib/zodSchemas/auth.schema";
import { useMutation } from "@tanstack/react-query";

export function useRegister() {
  const {
    mutate,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationKey: ["register"],
    mutationFn: (data: RegisterSchema) => register(data),
    onError: (err) => {
      console.log(error);
    },
  });

  return { mutate, isLoading, error };
}
