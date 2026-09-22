const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../engine.js'); require('../cards.js'); require('../ai.js');
const CB = globalThis.CB, E = CB.engine, C = CB.cards;
const heroes = { bruiser: 'vex', bulwark: 'thorn', trickster: 'odds' };
function game(a = 'bruiser', b = 'trickster', seed = 1) { const st = E.newGame(C.DECKS[a], C.DECKS[b], CB.heroes.byId[heroes[a]], CB.heroes.byId[heroes[b]], seed); E.startTurn(st); return st; }
test('all nine matchups finish with legal engine actions and finite resources across 1,800 seeded matches', () => {
  for (const a of Object.keys(heroes)) for (const b of Object.keys(heroes)) for (let seed = 1; seed <= 200; seed++) {
    const st = game(a, b, seed); let actions = 0;
    while (st.winner === null && actions++ < 100) {
      CB.ai.takeTurn(st, st.active); E.endTurn(st); E.startTurn(st);
      for (const p of st.players) { assert.ok(p.mana >= 0); assert.ok(p.tempMana >= 0); assert.ok(p.board.length <= 5); assert.ok(p.hand.length <= 10); }
    }
    assert.notEqual(st.winner, null, `${a} vs ${b} seed ${seed}`); assert.ok(['lethal', 'contest', 'deck-out'].includes(st.winReason));
  }
});
test('Clash that kills attacker prevents damage to defending hero', () => {
  const st = game(); const p = st.players[0]; p.hand = [C.byId['scrap-pup']]; p.mana = 10;
  E.playCard(st, 0, 0); const m = p.board[0]; const hp = st.players[1].hp;
  assert.ok(E.beginAttack(st, 0, m.uid, 'hero'));
  E.dealDamage(st, m, 3); E.resolveAttack(st, { attacker: m, defender: 'hero', negate: false });
  assert.equal(st.players[1].hp, hp); assert.equal(p.board.length, 0);
});
test('turn and target guards prevent illegal cards, attacks, powers, or spending after victory', () => {
  const st = game(); st.players[0].mana = 10; st.players[1].mana = 10;
  st.players[0].hand = [C.byId['throw-sand']]; assert.equal(E.playCard(st, 0, 0), false);
  assert.equal(E.playCard(st, 1, 0), false); assert.equal(E.heroPower(st, 0), false);
  st.winner = 0; st.players[0].hand = [C.byId['pit-rat']]; assert.equal(E.playCard(st, 0, 0), false); assert.equal(E.heroPower(st, 0), false);
  const saved = st.winner; st.players[0].deck = []; E.drawCard(st, st.players[0]); assert.equal(st.winner, saved);
});
test('a pending human Clash cannot be overwritten or skip to next turn', () => {
  const st = game(); const p = st.players[0]; p.hand = [C.byId['scrap-pup']]; p.mana = 10; E.playCard(st, 0, 0);
  E.beginAttack(st, 0, p.board[0].uid, 'hero'); const pending = st.pendingAttack; E.endTurn(st);
  assert.equal(st.active, 0); assert.equal(E.beginAttack(st, 0, p.board[0].uid, 'hero'), false); assert.equal(st.pendingAttack, pending);
});
