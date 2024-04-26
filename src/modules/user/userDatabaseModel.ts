import {sqliteTable, text} from "drizzle-orm/sqlite-core";
import { createId } from '@paralleldrive/cuid2';

export const users = sqliteTable('users', {
  id: text('id', { length: 128 }).$defaultFn(() => createId()).notNull(),
  name: text('name', { length: 100 }).notNull(),
  email: text('email', { length: 100 }).notNull(),
  password: text('password', { length: 100 }).notNull(),
})