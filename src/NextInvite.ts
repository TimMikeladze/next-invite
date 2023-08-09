import { nanoid } from 'nanoid';
import { NextTool } from 'next-tool';
import {
  CreateInviteArgs,
  DeleteInviteArgs,
  FindInviteArgs,
  GetInviteArgs,
  HandlerAction,
  InvalidateInviteArgs,
  Invite,
  NextInviteConfig,
  NextInviteStore,
  UseInviteArgs,
  zCreateInviteArgs,
  zDeleteInviteArgs,
  zFindInviteArgs,
  zGetInviteArgs,
  zInvalidateInviteArgs,
  zUseInviteArgs,
} from './types';

export class NextInvite extends NextTool<NextInviteConfig, NextInviteStore> {
  constructor(config: NextInviteConfig, store: NextInviteStore) {
    super(config, store, {
      [HandlerAction.createInvite]: (args) => this.createInvite(args),
      [HandlerAction.invalidateInvite]: (args) => this.invalidateInvite(args),
      [HandlerAction.findInvite]: (args) => this.findInvite(args),
      [HandlerAction.getInvite]: (args) => this.getInvite(args),
      [HandlerAction.deleteInvite]: (args) => this.deleteInvite(args),
      [HandlerAction.isValidInvite]: (args) => this.isValidInvite(args),
      [HandlerAction.useInvite]: (args) => this.useInvite(args),
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

  public async getInvite(args: GetInviteArgs): Promise<{ invite: Invite }> {
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

  public async isValidInvite(args: GetInviteArgs): Promise<boolean> {
    await this.init();

    const data = zGetInviteArgs.parse(args);

    const invite = await this.store!.getInvite({
      id: data.id,
    });

    if (invite.invalid) {
      return false;
    }

    if (invite.total && invite.remaining === 0) {
      return false;
    }

    return true;
  }

  public async useInvite(args: UseInviteArgs): Promise<{
    invite: Invite;
  }> {
    await this.init();

    const data = zUseInviteArgs.parse(args);

    const { invite } = await this.findInvite(data);

    if (!invite) {
      throw new Error(`Invite not found`);
    }

    if (!(await this.isValidInvite({ id: invite.id }))) {
      throw new Error(`Invite is invalid`);
    }

    const remaining = invite.total ? Number(invite.remaining) - 1 : 0;

    const invalid = invite.total ? remaining === 0 : !invite.unlimited;

    const usedInvite = await this.store!.useInvite({
      id: invite.id,
      remaining,
      invalid,
    });

    await this.store!.logInviteUse({
      id: nanoid(),
      inviteId: invite.id,
      email: invite.email,
      data: args.data,
    });

    return {
      invite: usedInvite,
    };
  }
}
