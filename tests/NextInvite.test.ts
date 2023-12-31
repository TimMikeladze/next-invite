import { resolve } from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest';
import { nanoid } from 'nanoid';
import { DrizzlePgStore, NextInvite, drizzlePgInvitesTable } from '../src';
import { NextInviteStore } from '../src/types';

import { getUpstash } from './store/upstash/getUpstash';
import { DrizzleUpstashStore } from '../src/store/upstash/DrizzleUpstashStore';
import { getDb } from './store/drizzle/pg/getDb';
import { drizzlePgInviteLogsTable } from '../src/store/drizzle/pg/DrizzlePgSchema';

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise((x) => setTimeout(x, ms));

const runTests = async (
  name: string,
  args: {
    afterEach?: () => Promise<void>;
    beforeEach?: () => Promise<void>;
    store: () => Promise<NextInviteStore>;
  }
) => {
  const config = {};

  beforeEach(async () => {
    await args.beforeEach?.();
  });

  afterEach(async () => {
    await args.afterEach?.();
  });

  describe(`NextInvite - ${name}`, () => {
    beforeEach(async () => {
      await args.beforeEach?.();
    });

    afterEach(async () => {
      await args.afterEach?.();
    });

    const { store } = args;

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

      it(`create invite for email`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        expect(invite.email).toEqual('foo@bar.com');
      });

      it(`create invite with expiration`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const expires = Date.now() + 1000;

        const { invite } = await nextInvite.createInvite({
          expires,
        });

        expect(nextInvite.isValidInviteById(invite)).to.resolves.toBeTruthy();

        await sleep(1000);

        expect(nextInvite.isValidInviteById(invite)).to.resolves.toBeFalsy();
      });
    });

    it('isValidInviteByCode', () => {
      it(`isValidInviteByCode`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite();

        expect(
          nextInvite.isValidInviteByCode({
            code: invite.code,
          })
        ).resolves.toBeTruthy();

        expect(
          nextInvite.isValidInviteByCode({
            code: `${invite.code}foo`,
          })
        ).resolves.toBeFalsy();
      });
      it(`isValidInviteByCode with email`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          email: 'foo@foo.com',
        });

        expect(
          nextInvite.isValidInviteByCode({
            code: invite.code,
            email: 'foo@foo.com',
          })
        ).resolves.toBeTruthy();
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

      expect(invalidInvite!.invalid).toBeTruthy();
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

        expect(usedInvite!.invalid).toBeTruthy();
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
      it(`use an invite with email but no code`, async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        expect(
          nextInvite.useInvite({
            email: 'foo@bar.com',
            code: '',
          })
        ).rejects.toThrowError('Invite not found');
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

        expect(usedInvite!.invalid).toBeFalsy();
        expect(usedInvite?.uses).toBe(3);
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

        expect(usedInvite!.invalid).toBeTruthy();

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
            logUsedInvites: true,
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
      it('try to use expired invited', async () => {
        const nextInvite = new NextInvite(config, store);

        await nextInvite.init();

        const expires = Date.now() + 1000;

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
          expires,
        });

        await sleep(1000);

        expect(
          nextInvite.useInvite({
            code: invite.code,
            email: 'foo@bar.com',
          })
        ).rejects.toThrowError('Invite is invalid');
      });
      it('calls onInviteUsed function', async () => {
        const onInviteUsed = vi.fn();

        const nextInvite = new NextInvite(
          {
            ...config,
            onInviteUsed,
          },
          store
        );

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        const res = await nextInvite.useInvite({
          code: invite.code,
          email: 'foo@bar.com',
        });

        expect(onInviteUsed).toHaveBeenCalled();

        expect(res.invite).toMatchObject({
          id: invite.id,
        });
      });
      it('calls onInviteUsed function with invite log', async () => {
        const onInviteUsed = vi.fn();

        const nextInvite = new NextInvite(
          {
            ...config,
            logUsedInvites: true,
            onInviteUsed,
          },
          store
        );

        await nextInvite.init();

        const { invite } = await nextInvite.createInvite({
          email: 'foo@bar.com',
        });

        const res = await nextInvite.useInvite({
          code: invite.code,
          email: 'foo@bar.com',
        });

        expect(onInviteUsed).toHaveBeenCalled();

        expect(res.invite).toMatchObject({
          id: invite.id,
        });

        expect(res.inviteLog).toBeDefined();
      });
    });
    describe('filter invites', () => {
      it('filter invites', async () => {
        const nextInvite = new NextInvite(
          {
            ...config,
            logUsedInvites: true,
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
            logUsedInvites: true,
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
          logUsedInvites: true,
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
          logUsedInvites: true,
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
          logUsedInvites: true,
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
  store: async () => new DrizzlePgStore(await getDb()),
  beforeEach: async () => {
    await migrate(await getDb(), {
      migrationsFolder: resolve(`tests/store/drizzle/pg/migrations`),
    });
    (await getDb()).delete(drizzlePgInvitesTable);
    (await getDb()).delete(drizzlePgInviteLogsTable);
  },
  afterEach: async () => {
    (await getDb()).delete(drizzlePgInvitesTable);
    (await getDb()).delete(drizzlePgInviteLogsTable);
  },
});

if (!process.env.CI) {
  runTests('UpstashStore', {
    store: async () => new DrizzleUpstashStore(getUpstash()),
  });
}
