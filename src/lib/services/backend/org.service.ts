import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schemas/organizations.schema";
import { User } from "@/lib/types/user.type";

interface createOrganizationServerProps {
  user: User;
  orgName: string;
  orgAvatar: string;
}
export const createOrganizationServer = async ({
  user,
  orgName,
  orgAvatar,
}: createOrganizationServerProps) => {
  const [org] = await db
    .insert(organizations)
    .values({
      name: orgName,
      avatar: orgAvatar || "",
      ownerId: user.id,
    })
    .returning();

  return org;
};
