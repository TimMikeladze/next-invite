import { resolve } from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { it, describe, expect, beforeEach, afterEach } from 'vitest';
import { nanoid } from 'nanoid';
import { DrizzlePgStore, NextInvite } from '../src';
import { NextInviteStore } from '../src/types';
import { getDb } from './db/getDb';
import {
  drizzlePgInviteLogsTable,
  drizzlePgInvitesTable,
} from '../src/store/drizzle/pg/DrizzlePgSchema';

const runTests = async (
  name: string,
  args: {
    afterEach?: () => Promise<void>;
    beforeEach?: () => Promise<void>;
    getStore: () => Promise<NextInviteStore>;
  }
) => {
  const config = {};

  beforeEach(async () => {
    await args.beforeEach?.();
  });

  afterEach(async () => {
    await args.afterEach?.();
  });

  const store = (await args.getStore) as any;

  describe(`NextInvite - ${name}`, () => {
    beforeEach(async () => {
      await args.beforeEach?.();
    });

    afterEach(async () => {
      await args.afterEach?.();
    });

    it(`initializes`, async () => {
      const nextInvite = new NextInvite(config, store);

      await nextInvite.init();
    });

    describe('create invite', () => {
      it(`creates invite`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite();

        expect(invite).toBeDefined();

        expect(invite.id).toBeDefined();
      });

      it('create invite with total uses', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          total: 5,
        });

        expect(invite).toBeDefined();

        expect(invite.id).toBeDefined();

        expect(invite.total).toBe(5);

        expect(invite.unlimited).toBeFalsy();
      });

      it(`create invite with unlimited uses`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          unlimited: true,
        });

        expect(invite).toBeDefined();

        expect(invite.id).toBeDefined();

        expect(invite.total).toBeNull();

        expect(invite.unlimited).toBeTruthy();
      });

      it(`creates invite with custom data and id`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const id = nanoid();

        const { invite } = await nextInvite.createInvite({
          id,
          data: { foo: 'bar' },
        });

        expect(invite).toBeDefined();

        expect(invite.id).toBe(id);

        expect(invite.data).toEqual({ foo: 'bar' });
      });

      it('create invite throw error on invalid args', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        expect(
          nextInvite.createInvite({
            email: 'foo@bar.com',
            total: 5,
          })
        ).rejects.toThrowError(
          "email, unlimited and total can't be used together"
        );

        expect(
          nextInvite.createInvite({
            email: 'foo@bar.com',
            unlimited: true,
          })
        ).rejects.toThrowError(
          "email, unlimited and total can't be used together"
        );

        expect(
          nextInvite.createInvite({
            total: 5,
            unlimited: true,
          })
        ).rejects.toThrowError(
          "email, unlimited and total can't be used together"
        );
      });
    });

    it('invalidate invite', async () => {
      const nextInvite = new NextInvite(config, store);

      await nextInvite.init();

      const { invite } = await nextInvite.createInvite();

      expect(invite.invalid).toBeFalsy();

      await nextInvite.invalidateInvite({
        id: invite.id,
      });

      const { invite: invalidInvite } = await nextInvite.getInvite(invite);

      expect(invalidInvite.invalid).toBeTruthy();
    });

    it('delete an invite', async () => {
      const nextInvite = new NextInvite(config, store);

      await nextInvite.init();

      const { invite } = await nextInvite.createInvite();

      await nextInvite.deleteInvite(invite);

      const { invite: deletedInvite } = await nextInvite.getInvite(invite);

      expect(deletedInvite).toBeUndefined();
    });

    describe('get invite', () => {
      it('get invite', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite();

        const { invite: foundInvite } = await nextInvite.getInvite(invite);

        expect(foundInvite).toEqual(invite);
      });
      it(`get invite not found`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite: foundInvite } = await nextInvite.getInvite({
          id: 'not-found',
        });

        expect(foundInvite).toBeUndefined();
      });
    });
    it('find invite', () => {
      it(`find invite`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite();

        const { invite: foundInvite } = await nextInvite.findInvite({
          code: invite.code,
        });

        expect(foundInvite).toEqual(invite);
      });
      it(`find invite with email`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        const { invite: foundInvite } = await nextInvite.findInvite({
          email: 'foo@bar.com',
          code: invite.code,
        });

        expect(foundInvite).toEqual(invite);
      });
      it(`find invite invalid email`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        const { invite: foundInvite } = await nextInvite.findInvite({
          email: 'wrong@bar.com',
          code: invite.code,
        });

        expect(foundInvite).toBeUndefined();
      });
      it(`find invite invalid code`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        const { invite: foundInvite } = await nextInvite.findInvite({
          email: 'foo@bar.com',
          code: '',
        });

        expect(foundInvite).toEqual(undefined);
      });
    });
    describe('use invite', () => {
      it('use an invite that doesnt exist', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        await nextInvite.createInvite();

        expect(
          nextInvite.useInvite({
            code: '',
          })
        ).rejects.toThrowError('Invite not found');
      });
      it('use an invite that is invalid', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite();

        await nextInvite.invalidateInvite(invite);

        expect(
          nextInvite.useInvite({
            code: invite.code,
          })
        ).rejects.toThrowError('Invite is invalid');
      });
      it('use an invite', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite();

        await nextInvite.useInvite({
          code: invite.code,
        });

        const { invite: usedInvite } = await nextInvite.getInvite(invite);

        expect(usedInvite.invalid).toBeTruthy();
      });
      it(`use an invite with email`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        const { invite: usedInvite } = await nextInvite.useInvite({
          code: invite.code,
          email: 'foo@bar.com',
        });

        expect(usedInvite.invalid).toBeTruthy();
      });
      it(`use an invite with an invalid email`, async () => {
        const nextInvite = new NextInvite(config, store);

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        expect(
          nextInvite.useInvite({
            code: invite.code,
            email: 'wrong@bar.com',
          })
        ).rejects.toThrowError('Invite not found');
      });
      it('use an invite with unlimited uses', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          unlimited: true,
        });

        await nextInvite.useInvite({
          code: invite.code,
        });

        await nextInvite.useInvite({
          code: invite.code,
        });

        await nextInvite.useInvite({
          code: invite.code,
        });

        const { invite: usedInvite } = await nextInvite.getInvite(invite);

        expect(usedInvite.invalid).toBeFalsy();
      });
      it('use an invite with total uses', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          total: 2,
        });

        await nextInvite.useInvite({
          code: invite.code,
        });

        await nextInvite.useInvite({
          code: invite.code,
        });

        const { invite: usedInvite } = await nextInvite.getInvite(invite);

        expect(usedInvite.invalid).toBeTruthy();

        expect(
          nextInvite.useInvite({
            code: invite.code,
          })
        ).rejects.toThrowError('Invite is invalid');
      });
      it('use an invite and log use', async () => {
        const nextInvite = new NextInvite(
          {
            ...config,
            logInviteUse: true,
          },
          store
        );

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        const { inviteLog } = await nextInvite.useInvite({
          code: invite.code,
          email: 'foo@bar.com',
        });

        expect(inviteLog?.inviteId).toEqual(invite.id);
        expect(inviteLog?.email).toEqual('foo@bar.com');
      });
    });
    describe('filter invites', () => {
      it('filter invites', async () => {
        const nextInvite = new NextInvite(
          {
            ...config,
            logInviteUse: true,
          },
          store
        );

        await nextInvite.init();

        await nextInvite.createInvite();

        const { invites } = await nextInvite.filterInvites();

        expect(invites.count).toBeGreaterThan(0);

        expect(invites.results.length).toBeLessThanOrEqual(10);
      });
      it('filter invites with limit', async () => {
        const nextInvite = new NextInvite(
          {
            ...config,
            logInviteUse: true,
          },
          store
        );

        await nextInvite.init();

        await nextInvite.createInvite();

        const { invites } = await nextInvite.filterInvites({
          limit: 1,
        });

        expect(invites.count).toBeGreaterThan(0);

        expect(invites.results.length).toBe(1);
      });
    });
    it(`filter invite logs`, async () => {
      const nextInvite = new NextInvite(
        {
          ...config,
          logInviteUse: true,
        },
        store
      );

      await nextInvite.init();

      const { invite } = await nextInvite.createInvite({});

      await nextInvite.useInvite({
        code: invite.code,
      });

      const { inviteLogs } = await nextInvite.filterInviteLogs();

      expect(inviteLogs.count).toBeGreaterThan(0);
    });
    it(`get invite log`, async () => {
      const nextInvite = new NextInvite(
        {
          ...config,
          logInviteUse: true,
        },
        store
      );

      await nextInvite.init();

      const { invite } = await nextInvite.createInvite({});

      const { inviteLog } = await nextInvite.useInvite({
        code: invite.code,
      });

      if (!inviteLog) {
        throw new Error('Invite log not found');
      }

      const { inviteLog: foundInviteLog } = await nextInvite.getInviteLog(
        inviteLog
      );

      expect(foundInviteLog).toEqual(inviteLog);
    });
    it('delete invite log', async () => {
      const nextInvite = new NextInvite(
        {
          ...config,
          logInviteUse: true,
        },
        store
      );

      await nextInvite.init();

      const { invite } = await nextInvite.createInvite();

      const { inviteLog } = await nextInvite.useInvite({
        code: invite.code,
      });

      if (!inviteLog) {
        throw new Error('Invite log not found');
      }

      await nextInvite.deleteInviteLog({
        id: inviteLog.id,
      });

      const { inviteLog: deletedInviteLog } = await nextInvite.getInviteLog(
        inviteLog
      );

      expect(deletedInviteLog).toBeUndefined();
    });
  });
};

runTests('DrizzlePgStore', {
  getStore: async () => new DrizzlePgStore(await getDb()),
  beforeEach: async () => {
    await migrate(await getDb(), {
      migrationsFolder: resolve(`tests/db/migrations`),
    });
    (await getDb()).delete(drizzlePgInvitesTable);
    (await getDb()).delete(drizzlePgInviteLogsTable);
  },
  afterEach: async () => {
    (await getDb()).delete(drizzlePgInvitesTable);
    (await getDb()).delete(drizzlePgInviteLogsTable);
  },
});

// runTests('UpstashStore', {});
