import {
  pgTable,
  jsonb,
  timestamp,
  varchar,
  bigint,
  boolean,
} from 'drizzle-orm/pg-core';

const createdAt = timestamp(`createdAt`, {
  withTimezone: true,
})
  .notNull()
  .defaultNow();

const updatedAt = timestamp(`updatedAt`, {
  withTimezone: true,
})
  .notNull()
  .defaultNow();

export const drizzlePgInvitesTable = pgTable(`next_invite_invites`, {
  createdAt,
  updatedAt,
  id: varchar(`id`).primaryKey(),
  data: jsonb(`data`).notNull().default({}),
  expires: bigint(`expires`, {
    mode: 'number',
  }),
  code: varchar(`code`).notNull().unique(),
  email: varchar(`email`),
  remaining: bigint(`remaining`, {
    mode: 'number',
  }),
  total: bigint(`total`, {
    mode: 'number',
  }),
  unlimited: boolean(`unlimited`).notNull().default(false),
  invalid: boolean(`invalid`).notNull().default(false),
});

export const drizzlePgInviteLogsTable = pgTable(`next_invite_invite_logs`, {
  createdAt,
  updatedAt,
  id: varchar(`id`).primaryKey(),
  inviteId: varchar(`inviteId`).references(() => drizzlePgInvitesTable.id, {
    onDelete: `cascade`,
    onUpdate: `cascade`,
  }),
  email: varchar(`email`),
  data: jsonb(`data`).notNull().default({}),
});
