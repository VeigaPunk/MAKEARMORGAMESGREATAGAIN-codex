# Clashbound

An original single-player arena card game: three champions, three 25-card decks, 44 card designs, explicit spell and hero-power targets, defensive Clash reactions, and two victory conditions. Every card has locally authored vector artwork. No runtime dependencies or network calls are required.

Open `index.html` directly, or use the root arcade build at `/clashbound/`. Desktop and phone layouts share the same rules. On phones, the hand scrolls horizontally while all five board slots remain visible.

Choose Bruiser/Vex, Bulwark/Mother Thorn, or Trickster/The Oddsmaker. Your rival gets a different deck. Select unwanted opening cards and confirm the redraw. Tap a card to play it; targeted spells and powers highlight legal targets. Select a ready minion, then a highlighted enemy or the rival hero bar to attack. Cancel selection or press Escape to back out. End turn passes priority to the AI; saved mana can fund a Clash spell on their turn. New game returns to champion selection and cancels pending AI actions.

A hero starts with 20 HP. Reduce your rival to zero, or reach eight contest points. At each turn end, the side with more **non-Guard** board attack scores one contest point. If that side trails by at least two points, it also steals one. Ties score nothing. Being three points behind grants one temporary Surge mana at the next turn start. Mana refills each turn, up to ten; boards hold five minions and hands ten cards. Drawing from an empty deck loses.

Guard minions draw attacks but do not contest. Pierce attackers bypass Guard and send excess minion damage to the hero. Blitz attacks immediately. Ward absorbs the first damage each turn. Warcry triggers on summon; Deathcry on defeat. Clash spells can only be played in the defensive reaction window.

Hero powers cost two mana, once per turn: Vex deals one damage to a chosen minion; Thorn adds one health to a chosen friendly minion; Oddsmaker removes three attack from the strongest enemy minion.

## Verification

From the repository root:

```sh
node --test tcg/prototype/tests/engine.test.cjs
node tcg/prototype/sim.js --matrix 200
# Serve the repository, then run the browser proof in another terminal:
python -m http.server 8080 --bind 127.0.0.1
node tcg/prototype/tests/browser.mjs
```

The engine suite completes 1,800 seeded matches across all nine deck/seat combinations and verifies illegal-turn guards, post-victory stability, pending Clash isolation, and killed-attacker cancellation. The browser proof uses Playwright with `CHROMIUM_PATH`, system Chromium, or the bundled browser; desktop clicks and emulated phone taps play full matches, select targets, reach results, and restart during an AI turn. Override `TCG_URL` to test a packaged build. Screenshots live in `tests/evidence/`.

The simulation supports `--deckA bruiser --deckB trickster`, numeric seed/count, and `--variant path/to/variant.js` for balance experiments. Variants are development-only and are not loaded by the game. All 44 card illustrations can be rebuilt with `node tcg/prototype/art/build-cards.cjs`.

The release scope is a complete solo match with stock decks. A collection, deck editor, multiplayer and mid-match persistence are outside that scope. Phone behavior is browser-emulated; real devices and assistive-technology interaction have not been independently certified.
