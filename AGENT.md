# DELTACHAT

chat with deltarune characters. currently deep in beta

This directory is the complete source of a websim project (id `c8c5y5j39t75ts4j8b4a`, checked out from version 324).
Live site: https://websim.com/p/c8c5y5j39t75ts4j8b4a

## Runtime contract — read before editing

This site is served by websim.com and runs inside a sandboxed iframe. At serve
time the platform injects a runtime script that defines global APIs. This is
why the code references globals that are never imported:

- `window.websim` (also reachable as `websim`) — platform APIs, documented below
- `WebsimSocket` — global class for multiplayer/database features

These globals are real and work in production. **Do not import, polyfill,
stub, or remove them.** Code that uses them is not broken.

Rules:
1. **No build tooling.** Never add package.json, node_modules, bundler or
   framework configs. The platform serves these files exactly as uploaded
   (`.jsx`/`.tsx` files are transpiled server-side automatically).
2. **Keep API calls relative.** `fetch('/api/v1/...')` is routed and
   authenticated by the platform. Never rewrite to absolute
   `https://api.websim.com/...` URLs.
3. **Libraries** come from CDN ESM imports (https://esm.sh) or a
   `<script type="importmap">` in index.html — not from npm installs.
4. File paths are **case-insensitive**; never create paths differing only by
   case. Keep asset references relative.
5. Preserve any `/* @tweakable */` comments exactly — they are a platform
   feature, not noise.
6. Do not modify `.websim.json`, `.websim-manifest.json`, or this file.
7. The platform injects analytics and social meta tags at serve time — do not
   add tracking or fight the injection.

## Local testing

```
websim dev          # from this directory → http://localhost:8787
```

This serves the files with a standalone SDK: `websim.chat`, `websim.imageGen`,
`websim.textToSpeech`, comments, and user/project info are REAL (authenticated
as the project owner); `WebsimSocket` multiplayer/database is a harmless local
stub. Known fidelity gaps vs production: visitors there may be anonymous (you
are always logged in locally), the production site runs in an iframe, and
`.jsx`/`.tsx` transpilation does not happen locally (plain `.js`/`.html`/`.css`
is unaffected).

## Platform API quick reference

```js
// AI — chat completion (returns { role: "assistant", content: string })
const msg = await websim.chat.completions.create({
  messages: [{ role: "user", content: "..." }], // role: "user" | "assistant" | "system"
  json: true, // optional: ask for a JSON-only answer (then JSON.parse(msg.content))
});

// AI — image generation (returns { url })
const img = await websim.imageGen({ prompt: "...", aspect_ratio: "1:1" /* optional: width, height, seed, transparent */ });

// AI — text to speech (returns { url } of audio)
const speech = await websim.textToSpeech({ text: "...", voice: "en-male" /* e.g. en-male, en-female, it-male */ });

// Identity & context
const user = await websim.getCurrentUser();      // { id, username, avatar_url }
const project = await websim.getCurrentProject(); // { id, title, description }

// Comments (the project's social feed; also usable as simple storage)
await websim.postComment({ content: "markdown **content**" }); // rate limit: 5/min
websim.addEventListener("comment:created", (data) => { /* live updates */ });
const res = await fetch(`/api/v1/projects/${project.id}/comments?first=50&sort_by=best`);
const { comments } = await res.json(); // { data: [{ comment, ... }], meta }
```

## Publishing

```
websim sync --no-open               # new version, immediately live
websim sync --no-open --no-promote  # new candidate version, live site unchanged
```
