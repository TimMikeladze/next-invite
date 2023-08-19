import { drizzle } from 'drizzle-orm/postgres-js';
import { and, desc, eq, sql } from 'drizzle-orm';
import {
  CreateInviteArgs,
  DeleteInviteArgs,
  DeleteInviteLogArgs,
  FilterInviteLogsArgs,
  FilterInvitesArgs,
  FindInviteArgs,
  GetInviteArgs,
  GetInviteLogArgs,
  InvalidateInviteArgs,
  LogInviteUseArgs,
  NextInviteStore,
} from '../../../types';
import {
  drizzlePgInviteLogsTable,
  drizzlePgInvitesTable,
} from './DrizzlePgSchema';

export class DrizzlePgStore implements NextInviteStore {
  private db: ReturnType<typeof drizzle>;

  constructor(db: ReturnType<typeof drizzle>) {
    this.db = db;
  }

  async filterInvites(args: FilterInvitesArgs) {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(drizzlePgInvitesTable);

    const count = Number(result?.[0]?.count || 0);

    if (!count) {
      return { count, results: [] };
    }

    let builder = this.db.select().from(drizzlePgInvitesTable);

    if (!args.all && args.limit) {
      builder = builder
        .limit(args.limit)
        .offset(args.offset || 0)
        .orderBy(desc(drizzlePgInvitesTable.updatedAt));
    }

    const rows = await builder;

    return {
      count,
      results: rows,
    };
  }

  async filterInviteLogs(args: FilterInviteLogsArgs) {
    const result = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(drizzlePgInviteLogsTable);

    const count = Number(result?.[0]?.count || 0);

    if (!count) {
      return { count, results: [] };
    }

    let builder = this.db.select().from(drizzlePgInviteLogsTable);

    if (!args.all && args.limit) {
      builder = builder
        .limit(args.limit)
        .offset(args.offset || 0)
        .orderBy(desc(drizzlePgInviteLogsTable.updatedAt));
    }

    const rows = await builder;

    return {
      count,
      results: rows,
    };
  }

  async findInvite(args: FindInviteArgs) {
    const andFilter = [
      eq(drizzlePgInvitesTable.code, args.code),
      args.email ? eq(drizzlePgInvitesTable.email, args.email) : undefined,
    ].filter(Boolean);

    const res = await this.db
      .select()
      .from(drizzlePgInvitesTable)
      .where(and(...andFilter))
      .limit(1);

    return res?.[0];
  }

  async createInvite(
    args: CreateInviteArgs & {
      code: string;
      id: string;
      remaining: number | null;
      unlimited: boolean;
    }
  ) {
    const res = await this.db
      .insert(drizzlePgInvitesTable)
      .values(args)
      .returning();

    return res?.[0];
  }

  async getInvite(args: GetInviteArgs) {
    const res = await this.db
      .select()
      .from(drizzlePgInvitesTable)
      .where(and(eq(drizzlePgInvitesTable.id, args.id)))
      .limit(1);

    return res?.[0];
  }

  async invalidateInvite(args: InvalidateInviteArgs) {
    const res = await this.db
      .update(drizzlePgInvitesTable)
      .set({ invalid: true })
      .where(and(eq(drizzlePgInvitesTable.id, args.id)))
      .returning();

    return res?.[0];
  }

  async deleteInvite(args: DeleteInviteArgs) {
    await this.db
      .delete(drizzlePgInvitesTable)
      .where(and(eq(drizzlePgInvitesTable.id, args.id)));
  }

  async useInvite(args: {
    id: string;
    invalid: boolean;
    remaining: number | null;
    uses: number;
  }) {
    const rows = await this.db
      .update(drizzlePgInvitesTable)
      .set({
        remaining: args.remaining,
        invalid: args.invalid,
        uses: args.uses,
      })
      .where(eq(drizzlePgInvitesTable.id, args.id))
      .returning();

    return rows?.[0];
  }

  async logInviteUse(args: LogInviteUseArgs) {
    const rows = await this.db
      .insert(drizzlePgInviteLogsTable)
      .values(args)
      .returning();

    return rows?.[0];
  }

  async deleteInviteLog(args: DeleteInviteLogArgs) {
    await this.db
      .delete(drizzlePgInviteLogsTable)
      .where(and(eq(drizzlePgInviteLogsTable.id, args.id)));
  }

  async getInviteLog(args: GetInviteLogArgs) {
    const res = await this.db
      .select()
      .from(drizzlePgInviteLogsTable)
      .where(and(eq(drizzlePgInviteLogsTable.id, args.id)))
      .limit(1);

    return res?.[0];
  }
}
