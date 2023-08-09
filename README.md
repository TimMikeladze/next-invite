# 📮 next-invite

A drop-in invite system for your Next.js app. Generate and share invite links for users to join your app.

Check out this [example](https://github.com/TimMikeladze/next-invite/tree/master/examples/next-invite-example) of a Next.js codebase showcasing an advanced implementation of `next-invite`.

> 🚧 Under active development. Expect breaking changes until v1.0.0.

## 📡 Install

```console
npm install next-invite

yarn add next-invite

pnpm add next-invites
```

> 👋 Hello there! Follow me [@linesofcode](https://twitter.com/linesofcode) or visit [linesofcode.dev](https://linesofcode.dev) for more cool projects like this one.

## 🚀 Getting Started

## 🧳 Storage

### 🔺 Upstash

### ☔️ Drizzle

#### 🐘 DrizzlePgStore - Postgres

<!-- TSDOC_START -->

## :wrench: Constants

- [zNextInviteConfig](#gear-znextinviteconfig)
- [zDeleteInviteArgs](#gear-zdeleteinviteargs)
- [zGetInviteArgs](#gear-zgetinviteargs)
- [zCreateInviteArgs](#gear-zcreateinviteargs)
- [zInvalidateInviteArgs](#gear-zinvalidateinviteargs)
- [zUseInviteArgs](#gear-zuseinviteargs)
- [zLogInviteUseArgs](#gear-zloginviteuseargs)

### :gear: zNextInviteConfig

| Constant            | Type                                                                                                                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zNextInviteConfig` | `ZodObject<{ enabledHandlerActions: ZodDefault<ZodArray<ZodNativeEnum<typeof HandlerAction>, "many">>; actions: ZodDefault<ZodRecord<ZodString, ZodFunction<...>>>; }, "strip", ZodTypeAny, { ...; }, { ...; }>` |

### :gear: zDeleteInviteArgs

| Constant            | Type                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------- |
| `zDeleteInviteArgs` | `ZodObject<{ id: ZodString; }, "strip", ZodTypeAny, { id?: string; }, { id?: string; }>` |

### :gear: zGetInviteArgs

| Constant         | Type                                                                                     |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `zGetInviteArgs` | `ZodObject<{ id: ZodString; }, "strip", ZodTypeAny, { id?: string; }, { id?: string; }>` |

### :gear: zCreateInviteArgs

| Constant            | Type                                                                                                                                                                                                                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| `zCreateInviteArgs` | `ZodObject<Pick<{ id: ZodDefault<ZodString>; email: ZodNullable<ZodOptional<ZodString>>; code: ZodString; expires: ZodNullable<...>; data: ZodOptional<...>; createdAt: ZodDate; updatedAt: ZodDate; invalid: ZodBoolean; }, "data" or ... 3 more ... | "expires">, "strip", ZodTypeAny, { ...; }, { ...; }>` |

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

- [namespaceFromEnv](#gear-namespacefromenv)
- [getConfig](#gear-getconfig)
- [getStore](#gear-getstore)
- [init](#gear-init)
- [handler](#gear-handler)
- [pagesApiHandler](#gear-pagesapihandler)
- [createInvite](#gear-createinvite)
- [invalidateInvite](#gear-invalidateinvite)
- [getInvite](#gear-getinvite)
- [deleteInvite](#gear-deleteinvite)
- [isValidInvite](#gear-isvalidinvite)
- [useInvite](#gear-useinvite)
- [rawHandler](#gear-rawhandler)

#### :gear: namespaceFromEnv

| Method             | Type                           |
| ------------------ | ------------------------------ |
| `namespaceFromEnv` | `(project?: string) => string` |

#### :gear: getConfig

| Method      | Type                                                                                                            |
| ----------- | --------------------------------------------------------------------------------------------------------------- |
| `getConfig` | `() => { enabledHandlerActions?: HandlerAction[]; actions?: Record<string, (...args: unknown[]) => unknown>; }` |

#### :gear: getStore

| Method     | Type                    |
| ---------- | ----------------------- |
| `getStore` | `() => NextInviteStore` |

#### :gear: init

| Method | Type                  |
| ------ | --------------------- |
| `init` | `() => Promise<void>` |

#### :gear: handler

| Method    | Type                                                                    |
| --------- | ----------------------------------------------------------------------- | ------------------------------- |
| `handler` | `(request: NextRequest) => Promise<void or NextResponse<{ data: any; }> | NextResponse<{ error: any; }>>` |

#### :gear: pagesApiHandler

| Method            | Type                                                                                                  |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------- |
| `pagesApiHandler` | `(request: NextApiRequest, response: NextApiResponse) => Promise<void or NextResponse<{ data: any; }> | NextResponse<{ error: any; }>>` |

#### :gear: createInvite

| Method         | Type                                                                                                                                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createInvite` | `(args: { data?: any; code?: string; id?: string; email?: string; expires?: number; }) => Promise<{ id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; updatedAt?: Date; invalid?: boolean; }>` |

#### :gear: invalidateInvite

| Method             | Type                                                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `invalidateInvite` | `(args: { id?: string; }) => Promise<{ id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; updatedAt?: Date; invalid?: boolean; }>` |

#### :gear: getInvite

| Method      | Type                                                                                                                                                                        |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `getInvite` | `(args: { id?: string; }) => Promise<{ id?: string; email?: string; code?: string; expires?: number; data?: any; createdAt?: Date; updatedAt?: Date; invalid?: boolean; }>` |

#### :gear: deleteInvite

| Method         | Type                                        |
| -------------- | ------------------------------------------- |
| `deleteInvite` | `(args: { id?: string; }) => Promise<void>` |

#### :gear: isValidInvite

| Method          | Type                                           |
| --------------- | ---------------------------------------------- |
| `isValidInvite` | `(args: { id?: string; }) => Promise<boolean>` |

#### :gear: useInvite

| Method      | Type                                                                      |
| ----------- | ------------------------------------------------------------------------- |
| `useInvite` | `(args: { code?: string; email?: string; data?: any; }) => Promise<void>` |

#### :gear: rawHandler

| Method       | Type                                                                        |
| ------------ | --------------------------------------------------------------------------- | ------------------------------- |
| `rawHandler` | `(handlerArgs: HandlerArgs) => Promise<void or NextResponse<{ data: any; }> | NextResponse<{ error: any; }>>` |

<!-- TSDOC_END -->
