import { resolve } from 'path';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { it, describe, beforeEach, afterEach } from 'vitest';
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

  describe(`NextUpload - ${name}`, () => {
    it(`initializes`, async () => {
      const nextInvite = new NextInvite(config, args.store);

      await nextInvite.init();
    });
  });
};

runTests('DrizzlePgStore', {
  store: async () => new DrizzlePgStore(await getDb()),
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
