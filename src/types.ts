import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server.js';
import { z } from 'zod';

// eslint-disable-next-line no-shadow
export enum HandlerAction {
  createInvite = 'createInvite',
  deleteInvite = 'deleteInvite',
  getInvite = 'getInvite',
  invalidateInvite = 'invalidateInvite',
  useInvite = 'useInvite',
}

export type SendFn = <JsonBody>(
  body: JsonBody,
  init?: { status?: number }
) => NextResponse<JsonBody> | Promise<void>;

export type NextInviteRequest = {
  body?: any;
  headers?: Headers;
};

export type HandlerArgs = {
  request: NextInviteRequest;
  send: SendFn;
};

export interface NextInviteStore {
  createInvite(args: CreateInviteArgs): Promise<Invite>;
  deleteInvite(args: DeleteInviteArgs): Promise<void>;
  getInvite(args: GetInviteArgs): Promise<Invite>;
  invalidateInvite(args: InvalidateInviteArgs): Promise<Invite>;
  logInviteUse(args: LogInviteUseArgs): Promise<void>;
  useInvite(args: UseInviteArgs): Promise<Invite>;
}

export type GetStoreFn = () => Promise<NextInviteStore | undefined>;

export const zNextInviteConfig = z.object({
  enabledHandlerActions: z
    .array(z.nativeEnum(HandlerAction))
    .default([])
    .optional(),
  actions: z.record(z.function()).default({}).optional(),
});

export type NextInviteConfig = z.infer<typeof zNextInviteConfig>;

export const zInvite = z.object({
  id: z.string().default(() => nanoid()),
  email: z.string().email().optional().nullable(),
  code: z.string(),
  expires: z.number().optional().nullable(),
  data: z.any().optional().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  invalid: z.boolean(),
});

export type Invite = z.infer<typeof zInvite>;

export const zDeleteInviteArgs = z.object({
  id: z.string(),
});

export type DeleteInviteArgs = z.infer<typeof zDeleteInviteArgs>;

export const zGetInviteArgs = z.object({
  id: z.string(),
});

export type GetInviteArgs = z.infer<typeof zGetInviteArgs>;

export const zCreateInviteArgs = zInvite.pick({
  id: true,
  email: true,
  code: true,
  expires: true,
  data: true,
});

export type CreateInviteArgs = z.infer<typeof zCreateInviteArgs>;

export const zInvalidateInviteArgs = z.object({
  id: z.string(),
});

export type InvalidateInviteArgs = z.infer<typeof zInvalidateInviteArgs>;

export const zUseInviteArgs = z.object({
  code: z.string(),
  email: z.string().email().optional().nullable(),
  data: z.any().optional().nullable(),
});

export type UseInviteArgs = z.infer<typeof zUseInviteArgs>;

export const zLogInviteUseArgs = z.object({
  id: z.string(),
  inviteId: z.string(),
  email: z.string().email().optional().nullable(),
  data: z.any().optional().nullable(),
});

export type LogInviteUseArgs = z.infer<typeof zLogInviteUseArgs>;
