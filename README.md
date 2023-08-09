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

### :gear: zInvite

| Constant  | Type                                                                                                                                                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zInvite` | `ZodObject<{ id: ZodString; email: ZodNullable<ZodOptional<ZodString>>; code: ZodString; expires: ZodNullable<ZodOptional<ZodNumber>>; ... 6 more ...; remaining: ZodNullable<...>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

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

## :factory: NextInvite

### Methods

- [createInvite](#gear-createinvite)
- [createInvite](#gear-createinvite)
- [invalidateInvite](#gear-invalidateinvite)
- [findInvite](#gear-findinvite)
- [getInvite](#gear-getinvite)
- [deleteInvite](#gear-deleteinvite)
- [isValidInvite](#gear-isvalidinvite)
- [useInvite](#gear-useinvite)

#### :gear: createInvite

| Method         | Type                                                                                                                                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `createInvite` | `(args: any) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; updatedAt?: Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; }; }>` |

#### :gear: createInvite

| Method         | Type                                                                                                                                                                                                                                                                        |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createInvite` | `(args?: { id?: string; email?: string; expires?: number; data?: any; unlimited?: boolean; total?: number; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; ... 4 more ...; remaining?: number; }; }>` |

#### :gear: invalidateInvite

| Method             | Type                                                                                                                                                                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalidateInvite` | `(args: { id?: string; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; updatedAt?: Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; }; }>` |

#### :gear: findInvite

| Method       | Type                                                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `findInvite` | `(args: { email?: string; code?: string; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; updatedAt?: Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; }; }>` |

#### :gear: getInvite

| Method      | Type                                                                                                                                                                                                                                              |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getInvite` | `(args: { id?: string; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; updatedAt?: Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; }; }>` |

#### :gear: deleteInvite

| Method         | Type                                           |
| -------------- | ---------------------------------------------- |
| `deleteInvite` | `(args: { id?: string; }) => Promise<boolean>` |

#### :gear: isValidInvite

| Method          | Type                                           |
| --------------- | ---------------------------------------------- |
| `isValidInvite` | `(args: { id?: string; }) => Promise<boolean>` |

#### :gear: useInvite

| Method      | Type                                                                                                                                                                                                                                                                            |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useInvite` | `(args: { code?: string; email?: string; data?: any; }) => Promise<{ invite: { id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; updatedAt?: Date; invalid?: boolean; unlimited?: boolean; total?: number; remaining?: number; }; }>` |

<!-- TSDOC_END -->
