import { Redis } from '@upstash/redis';
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
  Invite,
  InviteLog,
  LogInviteUseArgs,
  NextInviteStore,
} from '../../types';

export class DrizzleUpstashStore implements NextInviteStore {
  private db: Redis;

  private namespace: string;

  constructor(db: Redis, namespace: string = '') {
    this.db = db;
    this.namespace = namespace;
  }

  async filterInvites(args: FilterInvitesArgs) {
    let ids = await this.db.smembers(this.formatKey(['invites']));

    const count = Number(ids?.length || 0);

    if (!count) {
      return { count, results: [] };
    }

    ids = args.all ? ids : ids.slice(args.offset || 0, args.limit || 10);

    const rows = (
      await Promise.all(
        ids.map(async (id) => {
          const found = await this.getInvite({ id });
          return found;
        })
      )
    ).filter(Boolean);

    return {
      count: rows.length,
      results: rows as Invite[],
    };
  }

  async filterInviteLogs(args: FilterInviteLogsArgs) {
    let ids = await this.db.smembers(this.formatKey(['inviteLogs']));

    const count = Number(ids?.length || 0);

    if (!count) {
      return { count, results: [] };
    }

    ids = args.all ? ids : ids.slice(args.offset || 0, args.limit || 10);

    const rows = (
      await Promise.all(
        ids.map(async (id) => {
          const found = await this.getInviteLog({ id });
          return found;
        })
      )
    ).filter(Boolean);

    return {
      count: rows.length,
      results: rows as InviteLog[],
    };
  }

  async findInvite(args: FindInviteArgs) {
    const foundId = (await this.db.get(
      this.formatKey(['invite', 'code', args.code, 'email', args.email || ''])
    )) as string;

    if (!foundId) {
      return undefined;
    }

    const found = await this.getInvite({ id: foundId });

    if (!found) {
      return undefined;
    }

    if (found.code !== args.code) {
      return undefined;
    }

    if (args.email && found.email !== args.email) {
      return undefined;
    }

    return found;
  }

  private formatKey(parts: string[]) {
    return this.namespace
      ? `${this.namespace}:${parts.join(':')}`
      : parts.join(':');
  }

  async createInvite(
    args: CreateInviteArgs & {
      code: string;
      id: string;
      remaining: number | null;
      unlimited: boolean;
    }
  ) {
    if (await this.db.exists(this.formatKey(['invite', args.id]))) {
      throw new Error('Invite already exists');
    }

    const data = {
      ...args,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      invalid: false,
    };

    await this.db.set(
      this.formatKey(['invite', args.id]),
      JSON.stringify(data)
    );

    if (
      await this.db.exists(
        this.formatKey(['invite', 'code', args.code, args.email || ''])
      )
    ) {
      throw new Error('Invite code already exists');
    }

    await this.db.set(
      this.formatKey(['invite', 'code', args.code, 'email', args.email || '']),
      args.id
    );

    await this.db.sadd(this.formatKey(['invites']), data.id);

    return Promise.resolve(data);
  }

  async getInvite(args: GetInviteArgs) {
    const found = await this.db.get(this.formatKey(['invite', args.id]));

    if (!found) {
      return undefined;
    }

    return found as any as Invite;
  }

  async invalidateInvite(args: InvalidateInviteArgs) {
    const invite = await this.getInvite({ id: args.id });

    if (!invite) {
      throw new Error('Invite not found');
    }

    const data = {
      ...invite,
      invalid: true,
      updatedAt: new Date().toISOString(),
    };

    await this.db.set(this.formatKey(['invite', args.id]), data);

    return Promise.resolve(data);
  }

  async deleteInvite(args: DeleteInviteArgs) {
    const invite = await this.getInvite({ id: args.id });

    if (!invite) {
      throw new Error('Invite not found');
    }

    await this.db.del(this.formatKey(['invite', args.id]));

    await this.db.srem(this.formatKey(['invites']), args.id);

    await this.db.del(
      this.formatKey([
        'invite',
        'code',
        invite.code,
        'email',
        invite.email || '',
      ])
    );
  }

  async useInvite(args: {
    id: string;
    invalid: boolean;
    remaining: number | null;
  }) {
    const invite = await this.getInvite({ id: args.id });

    if (!invite) {
      throw new Error('Invite not found');
    }

    const data = {
      ...invite,
      invalid: args.invalid,
      remaining: args.remaining,
      updatedAt: new Date().toISOString(),
    };

    await this.db.set(
      this.formatKey(['invite', args.id]),
      JSON.stringify(data)
    );

    return Promise.resolve(data);
  }

  async logInviteUse(args: LogInviteUseArgs) {
    const data = {
      ...args,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.db.set(
      this.formatKey(['inviteLog', args.id]),
      JSON.stringify(data)
    );

    await this.db.sadd(this.formatKey(['inviteLogs']), args.id);

    return Promise.resolve(data);
  }

  async deleteInviteLog(args: DeleteInviteLogArgs) {
    await this.db.del(this.formatKey(['inviteLog', args.id]));
  }

  async getInviteLog(args: GetInviteLogArgs) {
    const found = await this.db.get(this.formatKey(['inviteLog', args.id]));

    if (!found) {
      return undefined;
    }

    return found as any as InviteLog;
  }
}
