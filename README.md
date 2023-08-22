# 📮 next-invite

A drop-in invite system for your Next.js app. Generate and share invite links for users to join your app.

Check out this [example](https://github.com/TimMikeladze/next-invite/tree/master/examples/next-invite-example) of a Next.js codebase showcasing an advanced implementation of `next-invite`.

> 🚧 Under active development. Expect breaking changes until v1.0.0.

## 📡 Install

```console
npm install next-invite

yarn add next-invite

pnpm add next-invite
```

> 👋 Hello there! Follow me [@linesofcode](https://twitter.com/linesofcode) or visit [linesofcode.dev](https://linesofcode.dev) for more cool projects like this one.

## 🚀 Getting Started

## 🧳 Storage

### 🔺 Upstash

### ☔️ Drizzle

#### 🐘 DrizzlePgStore - Postgres

<!-- TSDOC_START -->

## :wrench: Constants

- [zInvite](#gear-zinvite)
- [zDeleteInviteArgs](#gear-zdeleteinviteargs)
- [zGetInviteArgs](#gear-zgetinviteargs)
- [zFindInviteArgs](#gear-zfindinviteargs)
- [zCreateInviteArgs](#gear-zcreateinviteargs)
- [zInvalidateInviteArgs](#gear-zinvalidateinviteargs)
- [zUseInviteArgs](#gear-zuseinviteargs)
- [zLogInviteUseArgs](#gear-zloginviteuseargs)
- [zInviteLog](#gear-zinvitelog)
- [zBaseFilterArgs](#gear-zbasefilterargs)
- [zFilterInvitesArgs](#gear-zfilterinvitesargs)
- [zFilterInviteLogsArgs](#gear-zfilterinvitelogsargs)
- [zDeleteInviteLogArgs](#gear-zdeleteinvitelogargs)
- [zGetInviteLogArgs](#gear-zgetinvitelogargs)

### :gear: zInvite

| Constant  | Type                                                                                                                                                                                                                        |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zInvite` | `ZodObject<{ id: ZodString; email: ZodNullable<ZodOptional<ZodString>>; code: ZodString; expires: ZodNullable<ZodOptional<ZodNumber>>; ... 7 more ...; uses: ZodNullable<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zDeleteInviteArgs

| Constant            | Type                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `zDeleteInviteArgs` | `ZodObject<{ id: ZodString; }, "strip", ZodTypeAny, { id?: string; }, { id?: string; }>` |

### :gear: zGetInviteArgs

| Constant         | Type                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `zGetInviteArgs` | `ZodObject<{ id: ZodString; }, "strip", ZodTypeAny, { id?: string; }, { id?: string; }>` |

### :gear: zFindInviteArgs

| Constant          | Type                                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `zFindInviteArgs` | `ZodObject<{ email: ZodNullable<ZodOptional<ZodString>>; code: ZodString; }, "strip", ZodTypeAny, { email?: string; code?: string; }, { ...; }>` |

### :gear: zCreateInviteArgs

| Constant            | Type                                                                                                                                                                                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zCreateInviteArgs` | `ZodObject<{ id: ZodNullable<ZodOptional<ZodString>>; email: ZodNullable<ZodOptional<ZodString>>; expires: ZodNullable<...>; data: ZodNullable<...>; unlimited: ZodOptional<...>; total: ZodNullable<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zInvalidateInviteArgs

| Constant                | Type                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `zInvalidateInviteArgs` | `ZodObject<{ id: ZodString; }, "strip", ZodTypeAny, { id?: string; }, { id?: string; }>` |

### :gear: zUseInviteArgs

| Constant         | Type                                                                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zUseInviteArgs` | `ZodObject<{ code: ZodString; email: ZodNullable<ZodOptional<ZodString>>; data: ZodNullable<ZodOptional<ZodAny>>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zLogInviteUseArgs

| Constant            | Type                                                                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zLogInviteUseArgs` | `ZodObject<{ id: ZodString; inviteId: ZodString; email: ZodNullable<ZodOptional<ZodString>>; data: ZodNullable<ZodOptional<ZodAny>>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zInviteLog

| Constant     | Type                                                                                                                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zInviteLog` | `ZodObject<{ id: ZodString; inviteId: ZodNullable<ZodOptional<ZodString>>; email: ZodNullable<ZodOptional<ZodString>>; data: ZodNullable<...>; createdAt: ZodUnion<...>; updatedAt: ZodUnion<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zBaseFilterArgs

| Constant          | Type                                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zBaseFilterArgs` | `ZodObject<{ limit: ZodNullable<ZodOptional<ZodNumber>>; offset: ZodNullable<ZodOptional<ZodNumber>>; all: ZodNullable<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zFilterInvitesArgs

| Constant             | Type                                                                                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zFilterInvitesArgs` | `ZodObject<{ limit: ZodNullable<ZodOptional<ZodNumber>>; offset: ZodNullable<ZodOptional<ZodNumber>>; all: ZodNullable<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zFilterInviteLogsArgs

| Constant                | Type                                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zFilterInviteLogsArgs` | `ZodObject<{ limit: ZodNullable<ZodOptional<ZodNumber>>; offset: ZodNullable<ZodOptional<ZodNumber>>; all: ZodNullable<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zDeleteInviteLogArgs

| Constant               | Type                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------- |
| `zDeleteInviteLogArgs` | `ZodObject<{ id: ZodString; }, "strip", ZodTypeAny, { id?: string; }, { id?: string; }>` |

### :gear: zGetInviteLogArgs

| Constant            | Type                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `zGetInviteLogArgs` | `ZodObject<{ id: ZodString; }, "strip", ZodTypeAny, { id?: string; }, { id?: string; }>` |

## :factory: NextInvite

### Methods

- [createInvite](#gear-createinvite)
- [createInvite](#gear-createinvite)
- [invalidateInvite](#gear-invalidateinvite)
- [filterInvites](#gear-filterinvites)
- [filterInviteLogs](#gear-filterinvitelogs)
- [findInvite](#gear-findinvite)
- [getInvite](#gear-getinvite)
- [deleteInvite](#gear-deleteinvite)
- [getInviteLog](#gear-getinvitelog)
- [deleteInviteLog](#gear-deleteinvitelog)
- [isValidInviteById](#gear-isvalidinvitebyid)
- [isValidInviteByCode](#gear-isvalidinvitebycode)
- [useInvite](#gear-useinvite)

#### :gear: createInvite

| Method         | Type                                                                                                                                                         |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| `createInvite` | `(args: any) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: string or Date; updatedAt?: string | Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; uses?: number; }; }>` |

#### :gear: createInvite

| Method         | Type                                                                                                                                                                                                                                                                             |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createInvite` | `(args?: { id?: string; email?: string; expires?: number; data?: any; unlimited?: boolean; total?: number; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: string or Date; ... 5 more ...; uses?: number; }; }>` |

#### :gear: invalidateInvite

| Method             | Type                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `invalidateInvite` | `(args: { id?: string; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: string or Date; updatedAt?: string | Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; uses?: number; }; }>` |

#### :gear: filterInvites

| Method          | Type                                                                                                                                                                                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filterInvites` | `(args?: { limit?: number; offset?: number; all?: boolean; }) => Promise<{ invites: { count: number; results: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: string or Date; ... 5 more ...; uses?: number; }[]; }; }>` |

#### :gear: filterInviteLogs

| Method             | Type                                                                                                                                                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `filterInviteLogs` | `(args?: { limit?: number; offset?: number; all?: boolean; }) => Promise<{ inviteLogs: { count: number; results: { id?: string; inviteId?: string; email?: string; data?: any; createdAt?: string or Date; updatedAt?: string | Date; }[]; }; }>` |

#### :gear: findInvite

| Method       | Type                                                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `findInvite` | `(args: { email?: string; code?: string; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: string or Date; updatedAt?: string | Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; uses?: number; }; }>` |

#### :gear: getInvite

| Method      | Type                                                                                                                                                                      |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `getInvite` | `(args: { id?: string; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: string or Date; updatedAt?: string | Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; uses?: number; }; }>` |

#### :gear: deleteInvite

| Method         | Type                                           |
| -------------- | ---------------------------------------------- |
| `deleteInvite` | `(args: { id?: string; }) => Promise<boolean>` |

#### :gear: getInviteLog

| Method         | Type                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| `getInviteLog` | `(args: { id?: string; }) => Promise<{ inviteLog: { id?: string; inviteId?: string; email?: string; data?: any; createdAt?: string or Date; updatedAt?: string | Date; }; }>` |

#### :gear: deleteInviteLog

| Method            | Type                                           |
| ----------------- | ---------------------------------------------- |
| `deleteInviteLog` | `(args: { id?: string; }) => Promise<boolean>` |

#### :gear: isValidInviteById

| Method              | Type                                           |
| ------------------- | ---------------------------------------------- |
| `isValidInviteById` | `(args: { id?: string; }) => Promise<boolean>` |

#### :gear: isValidInviteByCode

| Method                | Type                                                             |
| --------------------- | ---------------------------------------------------------------- |
| `isValidInviteByCode` | `(args: { email?: string; code?: string; }) => Promise<boolean>` |

#### :gear: useInvite

| Method      | Type                                                                                                                                                                                                    |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `useInvite` | `(args: { code?: string; email?: string; data?: any; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: string or Date; updatedAt?: string | Date; ... 4 more ...; uses?: number; }; inviteLog?: { ...; }; }>` |

<!-- TSDOC_END -->
