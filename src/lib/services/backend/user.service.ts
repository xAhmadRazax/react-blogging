import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function getUser(
  id: string,
  optionalFields: Partial<{
    email: string;
    name: string;
    isVerified: boolean;
    passwordResetToken: string;
    passwordChangedAt: Date;
  }> = {},
) {
  const conditions = [eq(users.id, id)];

  if (optionalFields.email) {
    conditions.push(eq(users.email, optionalFields.email));
  }

  if (optionalFields.name) {
    conditions.push(eq(users.name, optionalFields.name));
  }

  if (optionalFields.isVerified !== undefined) {
    conditions.push(eq(users.isVerified, optionalFields.isVerified));
  }

  if (optionalFields.passwordChangedAt) {
    conditions.push(
      eq(users.passwordChangedAt, optionalFields.passwordChangedAt),
    );
  }
  return await db.query.users.findFirst({
    where: and(...conditions),
  });
}
