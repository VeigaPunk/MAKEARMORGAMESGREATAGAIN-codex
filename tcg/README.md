# Clashbound

An original arena card game with three champions, 44 illustrated cards, and two ways to win: defeat the rival hero or earn eight contest points. The complete solo game lives in `prototype/`; the historical folder name is retained for compatibility with existing links and balance tools.

Play `tcg/prototype/index.html` directly, or launch `/clashbound/` from the repository’s built arcade. No account, runtime dependency, or network request is needed. The responsive interface supports mouse, keyboard buttons, and touch, with deliberate targeting, defensive reactions, match results, and restart.

See [the game guide](prototype/README.md) for rules, controls, tests, and browser proof commands. The `design/` and `intel/` directories preserve the original design research; they are historical references rather than the current release contract. Experimental balance variants are in `prototype/variants/` and are not loaded by the shipped game.

```sh
node --test tcg/prototype/tests/engine.test.cjs
node tcg/prototype/sim.js --matrix 200
```

The engine suite covers 1,800 seeded matches plus Clash and turn-rule regressions. Browser proofs and screenshots live in `prototype/tests/`.
