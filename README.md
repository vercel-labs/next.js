# Minimal reproduction: Turbopack `next build` deadlocks at 0% CPU (async-loader chunk await cycle)

Related issue: https://github.com/vercel/next.js/issues/97398

## Run

```bash
npm install
npx next build     # never finishes; whole process tree sits at 0% CPU
```

Observed: the build prints `Creating an optimized production build ...` and then hangs forever
with no CPU usage and no error (verified for 15 minutes on Next.js `16.3.1` and `16.3.1-canary.19`).
Removing `experimental.turbopackClientSideNestedAsyncChunking: false` from `next.config.js` makes
the identical app build in ~7s.

## Shape (3 modules, 1 page)

```
app/page.js   --import()-->  modules/entry.js
modules/entry.js --import()--> modules/m0.js
modules/m0.js    --import()--> modules/m1.js
modules/m1.js    --import()--> modules/m0.js      <- ring, one level below the page
```

The ring must start *below* an async boundary (`entry.js`). If the page itself imports a ring
member, the parent chunk group already emits that async loader, it is recorded in the group's
availability, and the ring is defused (that shape builds fine).

## Why it deadlocks

With `enable_nested_async_availability = false`
(`turbopack/crates/turbopack-core/src/chunk/chunk_group.rs`, the `async_availability_info`
selection in `make_chunk_group`), async loaders created inside an async chunk group inherit the
*unchanged* availability of that group. So `Async(m0)[V]` emits `loader_m1[V]`, `Async(m1)[V]`
emits `loader_m0[V]` — the very same chunk group instance that is still being computed.

Combined with production content hashing for client chunks
(`ContentHashing::Direct` in `crates/next-core/src/next_client/context.rs`), a chunk's *path*
depends on its own *content*, and its content embeds the *paths* of the chunks of the async chunk
groups it references (`ChunkData::from_asset` in `turbopack/crates/turbopack-core/src/chunk/data.rs`).
The ring above closes that dependency into a task cycle, and turbo-tasks has no await-cycle
detection — every task parks on a `done_event` and the build silently hangs at 0% CPU.

`turbopackClientSideNestedAsyncChunking` is only used here to disable nested availability, which is
the *default* on the server side in `next build`
(`turbo_nested_async_chunking` in `crates/next-core/src/next_config.rs` returns `client_side` for
`NextMode::Build`). Server chunk names are ident based, so the same graph shape only deadlocks where
content hashing is on (client, production). This reproduction therefore demonstrates the exact
mechanism reported in #97398 (chunk path -> chunk content -> other chunks' paths -> back), while the
reporter's large app reaches the same ring through production chunk merging instead of the flag.
