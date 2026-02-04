import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { timestamps } from "@/lib/utils/drizzleTimeStamp.util";
import { users } from "./users.schema";
import { tenants } from "./tenants.schema";
import { roles } from "./roles.schema";
import { relations } from "drizzle-orm";

export const userTenants = pgTable(
  "user_tenants",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    joinedAt: timestamp("joined_at").defaultNow(),
    isActive: boolean("is_active").default(true),
    ...timestamps,
  },
  (table) => {
    return {
      // 1. The UNIQUE constraint preventing duplicate memberships
      userTenantUnique: unique().on(table.userId, table.tenantId),

      // 2. Index for finding all tenants a user belongs to
      userIdIdx: index("idx_user_tenants_user_id").on(table.userId),

      // 3. Index for finding all users in a specific tenant
      tenantIdIdx: index("idx_user_tenants_tenant_id").on(table.tenantId),
    };
  },
);

export const userTenantsRelations = relations(userTenants, ({ one }) => ({
  user: one(users, {
    fields: [userTenants.userId],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [userTenants.roleId],
    references: [roles.id],
  }),
}));
