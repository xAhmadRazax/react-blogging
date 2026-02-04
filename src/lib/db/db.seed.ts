import { db } from "./index"; // Path to your Drizzle db instance
import { roles, permissions, rolePermissions } from "./schema";

async function seed() {
  console.log("🌱 Bun is seeding your database...");

  try {
    // 1. Insert Granular Permissions
    const perms = await db
      .insert(permissions)
      .values([
        { name: "video:upload", resource: "video", action: "upload" },
        { name: "video:delete", resource: "video", action: "delete" },
        { name: "member:invite", resource: "member", action: "invite" },
        { name: "org:update", resource: "org", action: "update" },
      ])
      .returning();

    // 2. Insert Roles
    const [adminRole, memberRole] = await db
      .insert(roles)
      .values([
        { name: "admin", description: "The big boss of the tenant" },
        { name: "member", description: "A standard team member" },
      ])
      .returning();

    // 3. Link Admin Role to ALL Permissions
    const adminLinks = perms.map((p) => ({
      roleId: adminRole.id,
      permissionId: p.id,
    }));

    await db.insert(rolePermissions).values(adminLinks);

    console.log("✅ Database fueled and ready!");
  } catch (err) {
    console.error("❌ Seed failed. Are the tables empty?", err);
  }
}

seed();
