# Armor Arcade

Eight playable browser games, brought forward from the checkpoint into a single remake collection. Authored canvas/SVG art, synthesized sound, local saves, desktop controls, touch interfaces, and reproducible production builds.

## Play

[Open Armor Arcade on ChatGPT Sites](https://armor-arcade-veigapunk.jpveiga.chatgpt.site) (private access).

To run the same collection locally:

Requires Node.js 22.18+ (tested with Node 24). From this directory:

```bash
npm run setup
npm run build
npm start
```

Open **http://127.0.0.1:4173**. The collection links directly to all eight games. No accounts, API keys, external CDN, or game server are required. Sound starts after interaction; progress stays in the current browser. Keep the same hostname and port to keep using existing saves.

`dist/` is a self-contained static release. Serve that folder over HTTP, including under a subdirectory. `PORT=8080 npm start` changes the local port; `HOST=0.0.0.0 npm start` makes it reachable from another device on your network.

## The games

| Game | Shipped experience |
| --- | --- |
| **Boxhead** | Endless escalating survival, local co-op, first-to-five deathmatch, two arenas, four weapon tiers, crates, explosive barrels, score records. |
| **The Impossible Game** | Three progressively harder courses, normal/practice runs, checkpoints, instant retries, original synthesized rhythm bed, separate records and course unlocks. |
| **Burger Tycoon** | Four animated operations feeding one live economy, costly shortcuts and consequences, save/resume, bankruptcy or reputation collapse, survival records. |
| **Chicken Invaders** | Two sectors, three formations per sector, two bosses, weapon gifts, food, missiles, extra lives and saved chapter access. |
| **Cluck Horizon** | An original campaign on the shooter engine with its own birds, ship, bosses, weapons, colors and authored artwork. |
| **Swords & Sandals** | Twelve opponents across three tournaments, character builds, telegraphed combat, eight equipment upgrades, healer/retry, saved progression and champion replay. |
| **The World’s Hardest Game** | 114 verified challenges, coins, keys, doors, portals, sliding walls, medals, per-level records and accessible level selection. |
| **Clashbound** | Three illustrated card decks, directed attacks, reactive Clash spells, hero powers, comeback mana, contest/lethal wins, AI opponent and replay. |

## Verify

Install browser test binaries once (a system Chromium is used when present):

```bash
npx playwright install chromium firefox
npm run verify
```

The release gate typechecks every workspace, tests the shipping simulation rules, proves all 114 obstacle levels, builds the distribution, and exercises the production URLs in Chromium and Firefox. Deeper Chromium suites drive complete campaigns and score loops with legal player inputs, test saved-data recovery, and exercise emulated touch. Set `CHROMIUM_PATH` to use a particular Chromium executable.

`npm run package` also creates a reproducible Linux tarball and SHA-256 checksum in `releases/`. The GitHub workflow runs the same release gate and retains build and browser artifacts.

Individual checks:

```bash
npm run typecheck
npm test
node hardest/validate.mjs
npm run test:browser
```

See [release evidence and scope](verification/RELEASE.md). Browser report: `verification/browser-report/index.html` after running the suite. Gameplay covers in `arcade/covers/` come from the actual games.

## Source layout

- `arcade/`: collection page, game covers, shared return navigation.
- `tooling/`: static build, local server, complete browser gate.
- `MAGA-everything/02-code/armor-games/`: six Vite/TypeScript apps and shared engines.
- `hardest/`: dependency-free obstacle game, levels and completability verifier.
- `tcg/prototype/`: the playable Clashbound game; the legacy directory name is retained.
- `prototypes/`: earlier mechanics/art references, preserved as historical work.
- `MAGA-everything/01-design-docs/`: original reference dossiers and design decisions.

## Session artifact and hosting

The [session prompts](docs/session-prompts-2026-09-22.md) preserve the user's requests verbatim, including repeated prompts and the hosting-path correction.

ChatGPT Sites serves the static `dist/` directory. Its project identity and static configuration live in [.openai/hosting.json](.openai/hosting.json). Publishing uses the Sites workflow to push the source commit, package its build output, and deploy that saved version with private access. The games themselves need no server runtime. For another static host, copy the contents of `dist/` to its document directory; all game and asset URLs are relative. The requested fallback location is `https://ds4cc.com/magga/`.

## Distribution scope

The playable ChatGPT Site uses **private access**; the existing GitHub repository retains its current visibility. The games are authored remakes and an original card game; the release does not claim identical original assets, measured frame-for-frame fidelity, or the complete content catalogs of the commercial originals. Historical prototype and checkpoint reports are preserved; the release report records the current result.
