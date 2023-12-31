import { nanoid } from 'nanoid';
import { NextTool, NextToolStorePromise } from 'next-tool';
import {
  CreateInviteArgs,
  DeleteInviteArgs,
  DeleteInviteLogArgs,
  FilterInviteLogsArgs,
  FilterInvitesArgs,
  FindInviteArgs,
  GetInviteArgs,
  GetInviteLogArgs,
  NextInviteAction,
  InvalidateInviteArgs,
  Invite,
  InviteLog,
  NextInviteConfig,
  NextInviteStore,
  UseInviteArgs,
  zCreateInviteArgs,
  zDeleteInviteArgs,
  zDeleteInviteLogArgs,
  zFilterInvitesArgs,
  zFindInviteArgs,
  zGetInviteArgs,
  zGetInviteLogArgs,
  zInvalidateInviteArgs,
  zUseInviteArgs,
} from './types';

export class NextInvite extends NextTool<NextInviteConfig, NextInviteStore> {
  constructor(
    config: NextInviteConfig,
    store: NextToolStorePromise<NextInviteStore> | NextInviteStore
  ) {
    super(config, store, {
      [NextInviteAction.createInvite]: (args) => this.createInvite(args),
      [NextInviteAction.invalidateInvite]: (args) =>
        this.invalidateInvite(args),
      [NextInviteAction.findInvite]: (args) => this.findInvite(args),
      [NextInviteAction.getInvite]: (args) => this.getInvite(args),
      [NextInviteAction.deleteInvite]: (args) => this.deleteInvite(args),
      [NextInviteAction.isValidInvite]: (args) => this.isValidInviteById(args),
      [NextInviteAction.useInvite]: (args) => this.useInvite(args),
    });
  }

  public async createInvite(
    args: CreateInviteArgs = {}
  ): Promise<{ invite: Invite }> {
    await this.init();

    const data = zCreateInviteArgs.parse({
      id: nanoid(),
      ...args,
    });

    if ([data.email, data.unlimited, data.total].filter(Boolean).length > 1) {
      throw new Error("email, unlimited and total can't be used together");
    }

    return {
      invite: await this.store!.createInvite({
        ...data,
        total: data.total ? data.total : null,
        remaining: args.total ? args.total : null,
        code: nanoid(),
      }),
    };
  }

  public async invalidateInvite(
    args: InvalidateInviteArgs
  ): Promise<{ invite: Invite }> {
    await this.init();

    const data = zInvalidateInviteArgs.parse(args);

    const invite = await this.store!.invalidateInvite({
      id: data.id,
    });

    return { invite };
  }

  public async filterInvites(args: FilterInvitesArgs = {}) {
    await this.init();

    const data = zFilterInvitesArgs.parse({
      ...args,
      limit: args.limit || 10,
    });

    const invites = await this.store!.filterInvites(data);

    invites.results = invites.results.map((invite) => ({
      ...invite,
      // eslint-disable-next-line no-underscore-dangle
      invalid: !NextInvite._isValidInvite(invite),
    }));

    return { invites };
  }

  public async filterInviteLogs(args: FilterInviteLogsArgs = {}) {
    await this.init();

    const data = zFilterInvitesArgs.parse({
      ...args,
      limit: args.limit || 10,
    });

    const inviteLogs = await this.store!.filterInviteLogs(data);

    return { inviteLogs };
  }

  public async findInvite(
    args: FindInviteArgs
  ): Promise<{ invite: Invite | undefined }> {
    await this.init();

    const data = zFindInviteArgs.parse(args);

    return {
      invite: await this.store!.findInvite({
        code: data.code,
        email: data.email,
      }),
    };
  }

  public async getInvite(
    args: GetInviteArgs
  ): Promise<{ invite: Invite | undefined }> {
    await this.init();

    const data = zGetInviteArgs.parse(args);

    return {
      invite: await this.store!.getInvite({
        id: data.id,
      }),
    };
  }

  public async deleteInvite(args: DeleteInviteArgs): Promise<boolean> {
    await this.init();

    const data = zDeleteInviteArgs.parse(args);

    await this.store!.deleteInvite({
      id: data.id,
    });

    return true;
  }

  public async getInviteLog(args: GetInviteLogArgs) {
    await this.init();

    const data = zGetInviteLogArgs.parse(args);

    return {
      inviteLog: await this.store!.getInviteLog({
        id: data.id,
      }),
    };
  }

  public async deleteInviteLog(args: DeleteInviteLogArgs): Promise<boolean> {
    await this.init();

    const data = zDeleteInviteLogArgs.parse(args);

    await this.store!.deleteInviteLog({
      id: data.id,
    });

    return true;
  }

  public async isValidInviteById(args: GetInviteArgs): Promise<boolean> {
    await this.init();

    const data = zGetInviteArgs.parse(args);

    const invite = await this.store!.getInvite({
      id: data.id,
    });

    if (!invite) {
      return false;
    }

    // eslint-disable-next-line no-underscore-dangle
    return NextInvite._isValidInvite(invite);
  }

  public async isValidInviteByCode(args: FindInviteArgs): Promise<boolean> {
    await this.init();

    const data = zFindInviteArgs.parse(args);

    const { invite } = await this.findInvite(data);

    if (!invite) {
      return false;
    }

    // eslint-disable-next-line no-underscore-dangle
    return NextInvite._isValidInvite(invite);
  }

  public async useInvite(args: UseInviteArgs): Promise<{
    invite: Invite;
    inviteLog?: InviteLog;
  }> {
    await this.init();

    const data = zUseInviteArgs.parse(args);

    const { invite } = await this.findInvite(data);

    if (!invite) {
      throw new Error(`Invite not found`);
    }

    if (!(await this.isValidInviteById({ id: invite.id }))) {
      if (!invite.invalid) {
        await this.invalidateInvite({ id: invite.id });
      }
      throw new Error(`Invite is invalid`);
    }

    const remaining = invite.total ? Number(invite.remaining) - 1 : 0;

    const invalid = invite.total ? remaining === 0 : !invite.unlimited;

    const uses = invite.uses ? invite.uses + 1 : 1;

    const usedInvite = await this.store!.useInvite({
      id: invite.id,
      remaining,
      invalid,
      uses,
    });

    let inviteLog;

    if (this.config.logUsedInvites) {
      inviteLog = await this.store!.logInviteUse({
        id: nanoid(),
        inviteId: invite.id,
        email: invite.email,
        data: args.data,
      });
    }

    await this.config?.onInviteUsed?.(invite, inviteLog);

    return {
      invite: usedInvite,
      inviteLog,
    };
  }

  // eslint-disable-next-line no-underscore-dangle
  private static _isValidInvite(invite: Invite) {
    if (!invite) {
      return false;
    }

    if (invite.invalid) {
      return false;
    }

    if (invite.total && invite.remaining === 0) {
      return false;
    }

    if (invite.expires && Date.now() >= invite.expires) {
      return false;
    }

    return true;
  }
}
