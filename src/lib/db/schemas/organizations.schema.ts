import { relations } from "drizzle-orm";
import { z } from "zod";
import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  date,
  uuid,
  boolean,
  AnyPgColumn,
} from "drizzle-orm/pg-core";

import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { sessions } from "./sessions.schema";
import { emailVerifications } from "./emailVerifications.schema";
import { userRoles } from "./userRoles.schema";
import { passwordResets } from "./passwordResets.schema";
import { userTenants } from "./userTenants.schema";
import { timestamps } from "@/lib/utils/drizzleTimeStamp.util";
import { users } from "./users.schema";

export const genderEnum = pgEnum("gender", ["male", "female", "others"]);

export const organizations = pgTable("organization", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  ownerId: uuid("owner_id").references((): AnyPgColumn => users.id),
  //   should have post field

  ...timestamps,
});
