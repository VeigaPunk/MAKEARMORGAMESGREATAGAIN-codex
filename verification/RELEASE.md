# Private release 1.0 — 2026-09-22

This release continues checkpoint `322a5e4` and replaces the launch experience with an eight-game collection built into `dist/`. The original checkpoint reports remain historical evidence. This report describes the current shipped scope, rather than repeating the earlier prototype completion claims.

## Shipped content

| Game | Current scope | Completion evidence |
| --- | --- | --- |
| Boxhead | Endless solo/co-op; first-to-five deathmatch; two rooms; escalating waves capped at 32 simultaneous enemies; four weapons; wave resupply; high scores. | Input-only pilots survive six waves, die naturally on the seventh, save a score and restart. Deathmatch reaches five kills through movement, weapons and ammo pickups. |
| Impossible | Three authored courses with distinct palettes; normal unlock progression; practice checkpoints with separate records; title/pause/clear/retry. | Shipping simulation clears every course with discrete jumps. Production browser gate drives actual keyboard events through all three, verifies zero deaths, three records and unlocks. |
| Burger Tycoon | Four illustrated operations, shared economy, dirty-action consequences, visible toggle states, affordability feedback, pause, save/resume and survival record. | Pure rules prove clean bankruptcy and dirty-profit → disease → backlash → reputation collapse. Browser actions, mobile tabs, save/reload, pause and loss/retry are exercised. |
| Chicken Invaders | Two sectors, three formations each, two named bosses, distinct enemy types, pickups, missiles, extra lives and chapter persistence. | Seeded movement/fire pilot beats the entire campaign without editing health, enemies or score; separate loss/respawn and UI tests. |
| Cluck Horizon | Original ship, flock variants, bosses, pack-specific artwork and campaign on the shared shooter engine. | Same full legal-input campaign proof, with independent pack-specific stats, collisions and transitions. |
| Swords & Sandals | Twelve opponents across Sand Pit, Bronze Circuit and Imperial Games; eight equipment upgrades; distinct attack rhythms; save migration and champion replay. | 8,400 seeded campaigns cover all 84 initial builds, legal combat/rewards/shop/reload, maximum two defeats before completion. Full desktop and emulated-touch UI campaigns additionally verify every bout. |
| Hardest | 114 challenges; keys/doors, portals, moving walls, medals, fastest-time/fewest-death records, accessible level picker. | 114/114 schema/reachability/completion proofs with actual 60 Hz held inputs. Six representative proof tapes replay through browser animation frames and match engine time/deaths. |
| Clashbound | Three decks, 44 illustrated cards, board/hand targeting, hero powers, reactive Clash, contest/lethal victory, AI and restart. | 1,800 seeded matches across all nine matchups; turn/target/post-win guards; desktop/touch UI matches and restart while AI is pending. |

## Release gate

Run from the repository root:

```bash
npm run setup
npx playwright install chromium firefox
npm run verify
```

The gate performs workspace TypeScript checks, **35 simulation/regression tests**, **114 level proofs**, all six production builds, **44 production-browser checks across Chromium and Firefox**, then the deeper Boxhead/shooter/Hardest/arena/card browser suites. The browser checks use isolated storage and collect page failures. Full-input completion proofs are distinct from the separate fault-injection/collision unit tests; injected wins do not count as completion evidence.

The production browser matrix covers all eight game pages at desktop and phone widths, asset loading, navigation, the full three-course runner campaign, management loss/reload/retry, independent two-player input and pause/focus behavior. Deeper suites use Chromium touch emulation and verify the 12-bout tournament and card-game matches. The GitHub workflow runs this same gate; it has been added locally and is not claimed to have run remotely.

`npm run package` creates the static archive and its SHA-256 checksum. The release needs no CDN, backend service, API key or remote assets. Runtime dependency audit: `npm audit --omit=dev --audit-level=high` in the six-app workspace reports zero vulnerabilities.

## Final local result

All listed gates passed on the final source/distribution: eight workspace typechecks, 35 rule/regression cases, 114/114 level proofs, 44 Chromium/Firefox production checks, 11 dedicated browser cases for Boxhead and the shmups, six exact Hardest frame replays plus save/touch checks, all twelve gladiator bouts on desktop and emulated touch, and complete card matches/restarts on both input surfaces. The shield-rendering correction was followed by all four shooter browser regressions and four Firefox production checks. The eight-game subdirectory asset/navigation audit passed. `git diff --check` and the packaged archive checksum passed.

Archive: `releases/armor-arcade-1.0.0.tar.gz` (about 2.6 MB), with launch instructions and adjacent `.sha256`. The local server is available at `http://127.0.0.1:4173` while `npm start` runs. This section records the local verification completed before the subsequent user-requested GitHub push and private ChatGPT Sites publication; it does not assert a remote CI outcome.

## Repaired checkpoint blockers

- Hardest corrupt-save and medal-menu crashes; complete manifest/par correspondence; level 30 clipping; level 109/111 blocked routes; sub-frame proof mismatch; blur-stuck input.
- Swords & Sandals stored HTML/name/appearance injection, impossible progression, duplicate rewards/purchases, and recovery after defeat. Old valid four-win saves now continue into the second tournament.
- Boxhead end-banner/menu bleed, world/menu layering, simultaneous damage bursts, ammo starvation, two-player overlapping fire bindings and focus loss.
- Shooter chapter hazards leaking into the next sector, boss naming, wave numbering, score persistence, weaker weapon gifts, pointer ownership and touch release.
- Impossible sub-frame taps, block landing/exit collisions, focus/pause, practice score separation, full-course completion and unlocks.
- Burger small mobile controls, missing run recovery, lost keyboard shortcuts after button clicks, and scene effects retaining the previous company's clock.
- Clashbound dead attackers resolving after Clash, invalid targeting/turn actions, post-win spending, AI callbacks surviving a new game, and unreadable mobile hand/board layouts.

## Evidence and limits

- Collection screenshots: `verification/evidence/release/`.
- Actual gameplay covers: `arcade/covers/`.
- Playwright HTML report: `verification/browser-report/index.html` after verification.
- Per-game deep evidence: `apps/*/proofs/release/`, `apps/swords-and-sandals/tests/evidence/`, `tcg/prototype/tests/evidence/`, `hardest/browser-check.mjs` and `packages/shmup-core/tests/VERIFICATION.md`.

The production gate is automated on this Linux environment. Touch is emulated; physical Android/iOS devices and Safari are not verified. The remakes use authored assets, layouts, music and balanced rules informed by the repository references. Exact original physics, original licensed artwork/audio, and the complete commercial game catalogs are not claimed. The user subsequently requested a GitHub push and ChatGPT Sites hosting; the [session artifact](../docs/session-prompts-2026-09-22.md) records that authorization. The playable Site retains private access.
