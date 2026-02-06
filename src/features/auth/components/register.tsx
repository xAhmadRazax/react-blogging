"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, registerSchema } from "@/lib/zodSchemas/auth.schema";
import { useRegister } from "../hooks/use-register";
import { Field, FieldLabel } from "@/components/ui/field";
import { DatePickerField } from "@/components/ui/date-of-birth";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const Register = () => {
  const { mutate, isLoading, error } = useRegister();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<RegisterSchema>({
    mode: "onTouched",
    resolver: zodResolver(registerSchema),
  });

  const submitHandler = ({
    email,
    name,
    password,
    confirmPassword,
    dateOfBirth,
    gender,
  }: RegisterSchema) => {
    if (
      !email ||
      !name ||
      !password ||
      !confirmPassword ||
      !gender ||
      !dateOfBirth
    )
      return;

    mutate(
      { email, name, password, gender, dateOfBirth, confirmPassword },
      {
        onSuccess: () => {
          toast.success("user register successfully");
          reset();
          router.replace("/");
        },
        onError: (err) => {
          console.log(err);
          if (
            err &&
            typeof err === "object" &&
            "field" in err &&
            err?.field === "email"
          ) {
            setError("email", { message: "Email already exists" });
          }
          if (err && typeof err === "object" && "message" in err)
            toast.error(err?.message);
        },
      },
    );
  };

  return (
    <section className="border w-11/12 md:w-120 px-8 py-12 my-8 rounded-2xl shadow-xl transition-all relative ">
      <Link
        href=".."
        className="absolute top-4 left-4 shadow-neutral-200 shadow border border-neutral-50 rounded-full "
      >
        <ArrowLeft className="size-8 stroke-neutral-500" />
      </Link>
      <h2 className="text-3xl font-bold mb-4 text-center">
        Join{" "}
        <span className="whitespace-nowrap">
          <span className="text-indigo-700">React</span>-
          <span className="text-neutral-700">Blogging</span>
        </span>
      </h2>

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
            placeholder="Your name"
            className={`ring-1 ring-transparent ${
              errors.email ? "border-red-400 focus-visible:ring-red-400" : ""
            }`}
            {...register("email")}
          />
        </Field>
        {/* name */}
        <Field className="grid gap-1.5 relative">
          <FieldLabel htmlFor="name">Name*</FieldLabel>
          <Input
            type="text"
            title="Name"
            placeholder="you@email.com"
            className={`ring-1 ring-transparent  ${
              errors.name ? "border-red-400 focus-visible:ring-red-400" : ""
            }`}
            {...register("name")}
          />
        </Field>
        {/* password - confirm password wrapper*/}

        <div className="flex gap-6">
          <Field className="grid gap-1.5 relative w-full">
            <FieldLabel htmlFor="password">Password*</FieldLabel>
            <Input
              type="password"
              title="Password"
              placeholder="******"
              className={`ring-1 ring-transparent ${
                errors.password
                  ? "border-red-400 focus-visible:ring-red-400"
                  : ""
              }`}
              {...register("password", {})}
            />
          </Field>

          <Field className="grid gap-1.5 relative w-full">
            <FieldLabel htmlFor="confirm-password">
              Confirm Password*
            </FieldLabel>
            <Input
              type="password"
              title="ConfirmPassword"
              placeholder="******"
              className={`ring-1 ring-transparent ${
                errors.confirmPassword
                  ? "border-red-400 focus-visible:ring-red-400"
                  : ""
              }`}
              {...register("confirmPassword")}
            />
          </Field>
        </div>

        <div className="flex gap-6">
          <Field className="grid gap-1.5 relative w-full">
            <FieldLabel htmlFor="gender">Gender*</FieldLabel>
            <Controller
              control={control}
              name="gender"
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.gender
                        ? "border-red-400 focus-visible:ring-red-400"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="select a gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>

          <DatePickerField
            control={control}
            label="Date of birth"
            name="dateOfBirth"
            error={!!errors.dateOfBirth}
          />
        </div>
        {/* Errors */}
        <div className="transition-all">
          {errors?.email && (
            <p className="text-red-500 text-xs">
              {errors!.email.message as string}
            </p>
          )}
          {errors?.name && (
            <p className="text-red-500 text-xs">
              {errors!.name.message as string}
            </p>
          )}
          {errors?.password && (
            <p className="text-red-500 text-xs">
              {errors!.password.message as string}
            </p>
          )}
          {errors?.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors!.confirmPassword.message as string}
            </p>
          )}
          {errors?.gender && (
            <p className="text-red-500 text-xs">
              {errors!.gender.message as string}
            </p>
          )}
          {errors?.dateOfBirth && (
            <p className="text-red-500 text-xs">
              {errors!.dateOfBirth.message as string}
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
            {isLoading ? <Spinner /> : "Create Account"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default Register;
