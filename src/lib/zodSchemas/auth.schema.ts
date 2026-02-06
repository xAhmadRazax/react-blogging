import z, { email } from "zod";
export const CheckIdentifierAvailabilitySchema = z.object({
  email: z
    .email("invalid Email address")
    .trim()
    .min(1, "Please enter an email address"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Email cannot be empty"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    dateOfBirth: z.date({
      error: "Date of birth cannot be empty",
    }),
    gender: z.enum(["male", "female", "others"], {
      error: "Gender cannot be empty",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // This attaches the error to the specific field
  });

// This line gives you perfect TypeScript types automatically
export type RegisterSchema = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .email("invalid Email address")
    .trim()
    .min(1, "Please enter an email address"),
  password: z
    .string()
    .min(8, "invalid Password, password must have at least 8 character"),
});
export type LoginSchema = z.infer<typeof loginSchema>;

export const ForgotPasswordSchema = z.object({
  email: z
    .email("invalid Email address")
    .trim()
    .min(1, "Please enter an email address"),
});

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "invalid Password, password must have at least 8 character"),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(
        8,
        "invalid Current Password, current password must have at least 8 character",
      ),

    newPassword: z
      .string()
      .min(
        8,
        "invalid New Password, New password must have at least 8 character",
      ),
  })
  .refine((data) => data.currentPassword === data.newPassword, {
    message: "New password cannot be same as current password",
    path: ["newPassword"],
  });
