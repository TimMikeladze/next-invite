import { NextRequest, NextResponse } from 'next/server.js';
import { NextApiRequest, NextApiResponse } from 'next/types';
import { nanoid } from 'nanoid';
import {
  CreateInviteArgs,
  DeleteInviteArgs,
  GetInviteArgs,
  GetStoreFn,
  HandlerAction,
  HandlerArgs,
  InvalidateInviteArgs,
  Invite,
  NextInviteConfig,
  NextInviteStore,
  UseInviteArgs,
  zCreateInviteArgs,
  zDeleteInviteArgs,
  zGetInviteArgs,
  zInvalidateInviteArgs,
  zNextInviteConfig,
  zUseInviteArgs,
} from './types';

export class NextInvite {
  private store: NextInviteStore | undefined;

  private getStoreFn: GetStoreFn;

  private config: NextInviteConfig;

  constructor(config: NextInviteConfig, store: GetStoreFn | NextInviteStore) {
    this.config = zNextInviteConfig.parse(config);
    const getStoreFn = (
      store !== undefined
        ? typeof store === 'function'
          ? store
          : () => Promise.resolve(store)
        : undefined
    ) as GetStoreFn;
    if (!getStoreFn) {
      throw new Error('NextInvite: store is undefined');
    }
    this.getStoreFn = getStoreFn;
  }

  public static namespaceFromEnv(project?: string) {
    if (process.env.VERCEL) {
      return NextInvite.namespaceFromVercel();
    }

    return [`localhost`, project, process.env.NODE_ENV]
      .filter(Boolean)
      .join('-')
      .toLowerCase();
  }

  private static namespaceFromVercel() {
    return [
      process.env.VERCEL_GIT_REPO_OWNER,
      process.env.VERCEL_GIT_REPO_SLUG,
      process.env.VERCEL_ENV,
    ]
      .join('-')
      .toLowerCase();
  }

  public getConfig() {
    return this.config;
  }

  public getStore() {
    return this.store;
  }

  public async init() {
    if (!this.store && this.getStoreFn) {
      this.store = await this.getStoreFn?.();
    }
  }

  public async handler(request: NextRequest) {
    const body = await request.json();

    return this.rawHandler({
      send: NextResponse.json,
      request: {
        body,
        headers: request.headers,
      },
    });
  }

  public async pagesApiHandler(
    request: NextApiRequest,
    response: NextApiResponse
  ) {
    const { body, headers } = request;

    const json = async (data: any, options?: { status?: number }) =>
      response.status(options?.status || 200).json(data);

    return this.rawHandler({
      send: json,
      request: {
        body,
        headers: headers as any,
      },
    });
  }

  public async createInvite(args: CreateInviteArgs): Promise<Invite> {
    await this.init();

    const data = zCreateInviteArgs.parse({
      ...args,
    });

    return this.store!.createInvite(data);
  }

  public async invalidateInvite(args: InvalidateInviteArgs): Promise<Invite> {
    await this.init();

    const data = zInvalidateInviteArgs.parse(args);

    return this.store!.invalidateInvite({
      id: data.id,
    });
  }

  public async getInvite(args: GetInviteArgs): Promise<Invite> {
    await this.init();

    const data = zGetInviteArgs.parse(args);

    return this.store!.getInvite({
      id: data.id,
    });
  }

  public async deleteInvite(args: DeleteInviteArgs) {
    await this.init();

    const data = zDeleteInviteArgs.parse(args);

    await this.store!.deleteInvite({
      id: data.id,
    });
  }

  public async isValidInvite(args: GetInviteArgs) {
    await this.init();

    const data = zGetInviteArgs.parse(args);

    const invite = await this.store!.getInvite({
      id: data.id,
    });

    return !invite.invalid;
  }

  public async useInvite(args: UseInviteArgs) {
    await this.init();

    const data = zUseInviteArgs.parse(args);

    const invite = await this.store!.useInvite(data);

    await this.store!.logInviteUse({
      id: nanoid(),
      inviteId: invite.id,
      email: invite.email,
      data: args.data,
    });
  }

  public async rawHandler(handlerArgs: HandlerArgs) {
    const { send, request } = handlerArgs;

    if (!request.body) {
      return send({ error: `No body` }, { status: 400 });
    }

    const { action, args } = request.body;

    if (!action) {
      return send({ error: `No action` }, { status: 400 });
    }

    const enabledActions = this.config.enabledHandlerActions;

    if (!enabledActions.includes(action)) {
      return send({ error: `Action "${action}" not enabled` }, { status: 400 });
    }

    await this.init();

    const { actions } = this.config;

    const actionFn = (
      {
        [HandlerAction.createInvite]: () => this.createInvite(args),
        [HandlerAction.deleteInvite]: () => this.deleteInvite(args),
        [HandlerAction.getInvite]: () => this.getInvite(args),
        [HandlerAction.invalidateInvite]: () => this.invalidateInvite(args),
        [HandlerAction.useInvite]: () => this.useInvite(args),
        ...actions,
      } as any
    )[action];

    if (!actionFn) {
      return send({ error: `Unknown action "${action}"` }, { status: 400 });
    }

    try {
      const data = await actionFn();

      return send({ data });
    } catch (error) {
      console.error(error);
      return send({ error: (error as any).message }, { status: 500 });
    }
  }
}
