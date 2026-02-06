"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, loginSchema } from "@/lib/zodSchemas/auth.schema";
import { useRegister } from "../hooks/use-register";
import { Field, FieldLabel } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLogin } from "../hooks/use-login";

const Login = () => {
  const { mutate, isLoading, error } = useLogin();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    mode: "onTouched",
    resolver: zodResolver(loginSchema),
  });

  const submitHandler = ({ email, password }: LoginSchema) => {
    if (!email || !password) return;

    mutate(
      { email, password },
      {
        onSuccess: () => {
          toast.success("user Login successfully");
          reset();
          router.replace("/");
        },
        onError: (err) => {
          if (err && typeof err === "object" && "message" in err)
            toast.error(err?.message);
        },
      },
    );
  };

  return (
    <section className="border w-11/12 md:w-95 px-8 py-12 my-8 rounded-2xl shadow-xl transition-all relative ">
      <Link
        href=".."
        className="absolute top-4 left-4 shadow-neutral-200 shadow border border-neutral-50 rounded-full "
      >
        <ArrowLeft className="size-8 stroke-neutral-500" />
      </Link>
      <h2 className="text-3xl font-bold mb-4 text-center ">Login</h2>

      <form
        className="space-y-3.5 transition-all"
        onSubmit={handleSubmit(submitHandler)}
      >
        {/* email */}
        <Field className="grid gap-1.5 relative">
          <FieldLabel className="" htmlFor="email">
            Email*
          </FieldLabel>
          {/* <input type="email" /> */}
          <Input
            type="email"
            title="email"
            className={`ring-1 ring-transparent ${
              errors.email ? "border-red-400 focus-visible:ring-red-400" : ""
            }`}
            {...register("email")}
          />
        </Field>

        {/* password - confirm password wrapper*/}

        <Field className="grid gap-1.5 relative w-full">
          <FieldLabel htmlFor="password">Password*</FieldLabel>
          <Input
            type="password"
            title="Password"
            className={`ring-1 ring-transparent ${
              errors.password ? "border-red-400 focus-visible:ring-red-400" : ""
            }`}
            {...register("password", {})}
          />
        </Field>

        {/* Errors */}
        <div className="transition-all">
          {errors?.email && (
            <p className="text-red-500 text-xs">
              {errors!.email.message as string}
            </p>
          )}
          {errors?.password && (
            <p className="text-red-500 text-xs">
              {errors!.password.message as string}
            </p>
          )}
        </div>

        {/* buttons containers */}
        <div className="mt-8">
          <Button
            variant={"default"}
            type="submit"
            className="w-full bg-indigo-700"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Login"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Login;
