import { z } from "zod";
import { userSelectSchema } from "../db/schema";

// This is exactly what the frontend sees
// We omit the password because we never send it to the client
export const clientUserSchema = userSelectSchema.omit({
  password: true,
});

export type User = z.infer<typeof clientUserSchema>;

// If your /me route also returns roles or tenant info:
export type UserWithRelations = User & {
  userRoles?: { role: string }[];
  // Add other relations here as needed
};
