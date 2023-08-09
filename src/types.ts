import { z } from 'zod';
import { NextToolConfig } from 'next-tool';

// eslint-disable-next-line no-shadow
export enum HandlerAction {
  createInvite = 'createInvite',
  deleteInvite = 'deleteInvite',
  findInvite = 'findInvite',
  getInvite = 'getInvite',
  invalidateInvite = 'invalidateInvite',
  isValidInvite = 'isValidInvite',
  useInvite = 'useInvite',
}

export type NextInviteConfig = NextToolConfig;

export interface NextInviteStore {
  createInvite(
    args: CreateInviteArgs & {
      code: string;
      remaining?: number | null;
    }
  ): Promise<Invite>;
  deleteInvite(args: DeleteInviteArgs): Promise<void>;
  findInvite(args: FindInviteArgs): Promise<Invite | undefined>;
  getInvite(args: GetInviteArgs): Promise<Invite>;
  invalidateInvite(args: InvalidateInviteArgs): Promise<Invite>;
  logInviteUse(args: LogInviteUseArgs): Promise<void>;
  useInvite(args: {
    id: string;
    invalid: boolean;
    remaining: number | null;
  }): Promise<Invite>;
}

export const zInvite = z.object({
  id: z.string(),
  email: z.string().email().optional().nullable(),
  code: z.string(),
  expires: z.number().optional().nullable(),
  data: z.any().optional().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
  invalid: z.boolean(),
  unlimited: z.boolean(),
  total: z.number().optional().nullable(),
  remaining: z.number().optional().nullable(),
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

export const zFindInviteArgs = z.object({
  email: z.string().email().optional().nullable(),
  code: z.string(),
});

export type FindInviteArgs = z.infer<typeof zFindInviteArgs>;

export const zCreateInviteArgs = z.object({
  id: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  expires: z.number().optional().nullable(),
  data: z.any().optional().nullable(),
  unlimited: z.boolean().optional().nullish(),
  total: z.number().optional().nullable(),
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
