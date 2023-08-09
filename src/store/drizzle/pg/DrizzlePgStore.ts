import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import {
  CreateInviteArgs,
  DeleteInviteArgs,
  FindInviteArgs,
  GetInviteArgs,
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
  }) {
    const rows = await this.db
      .update(drizzlePgInvitesTable)
      .set({
        remaining: args.remaining,
        invalid: args.invalid,
      })
      .where(eq(drizzlePgInvitesTable.id, args.id))
      .returning();

    return rows?.[0];
  }

  async logInviteUse(args: LogInviteUseArgs) {
    await this.db.insert(drizzlePgInviteLogsTable).values(args).returning();
  }
}
