// Original authored vector illustrations. Rebuild with node tcg/prototype/art/build-cards.cjs.
const fs = require('node:fs');
const path = require('node:path');
require('../engine.js'); require('../cards.js');
for (const c of globalThis.CB.cards.POOL) {
  const seed = [...c.id].reduce((v, x) => (v * 31 + x.charCodeAt(0)) >>> 0, 7);
  const palettes = [['#db8b49','#67392c','#f5d79a'],['#84b692','#294548','#c7e4b2'],['#b091d8','#423959','#e0caf1'],['#75b6d1','#2d4b67','#cbebee'],['#d4b966','#4d4c35','#f5e1a4']];
  const [light, dark, bright] = palettes[seed % palettes.length];
  const beast = /rat|pup|dog|mule|teeth/.test(c.id), mystic = /shaman|bookie|seller|medic|announcer/.test(c.id), guard = (c.keywords || []).includes('Guard');
  let subject;
  if (c.type === 'spell') {
    const glyph = c.clashOnly ? '<path d="M57 27L103 27L98 78L80 98L62 78Z"/><path d="M78 42L70 64H86L77 85" fill="none" stroke-width="5"/>' : /draw|rigged|push/.test(c.id + c.text) ? '<path d="M50 32L95 25L106 84L62 91Z"/><path d="M64 32L107 40L97 97L55 89Z"/><path d="M73 48L89 50L85 78L69 76Z" fill="none"/>' : '<path d="M99 17L62 64L78 66L61 104L103 55L85 53Z"/>';
    subject = `<g fill="${light}" stroke="${bright}" stroke-width="2">${glyph}</g><circle cx="81" cy="62" r="45" fill="none" stroke="${bright}" opacity=".3" stroke-dasharray="5 9"/>`;
  } else if (beast) {
    subject = `<path d="M32 96Q29 67 45 54L43 27L66 42Q77 31 94 45L120 31L114 59Q135 89 111 105Z" fill="${dark}" stroke="${light}" stroke-width="3"/><path d="M53 71Q80 89 111 70L99 92L65 97Z" fill="#111c25"/><path d="M67 82L74 94L80 85M95 81L89 94L84 85" fill="${bright}"/><path d="M52 61L72 67L64 72ZM89 68L108 57L103 69Z" fill="${bright}"/><path d="M49 104L114 104" stroke="${light}" stroke-width="5"/>`;
  } else {
    subject = `<path d="M35 116L41 84L64 75L96 75L121 87L126 116Z" fill="${dark}" stroke="${light}" stroke-width="3"/><path d="M62 45Q79 28 98 48L97 77L80 87L63 76Z" fill="#ba9074" stroke="#18202a" stroke-width="2"/><path d="M56 49Q55 16 81 21Q108 22 105 55L93 45L78 42L67 54Z" fill="${mystic ? dark : light}" stroke="${bright}" stroke-width="2"/><path d="M68 59L76 61M87 60L95 57" stroke="#1c222b" stroke-width="4"/><path d="M72 72L91 71" stroke="#754d3b" stroke-width="2"/><path d="M62 88L80 102L99 88M47 106L112 106" stroke="${light}" stroke-width="4"/>`;
    if (mystic) subject += `<path d="M119 115L131 33" stroke="${light}" stroke-width="5"/><circle cx="132" cy="28" r="10" fill="${bright}"/><path d="M62 78L80 98L95 77" fill="${light}"/><circle cx="80" cy="32" r="6" fill="${bright}"/>`;
    else if (guard) subject += `<path d="M22 70L59 67L56 103L40 117L24 106Z" fill="${light}" stroke="${bright}" stroke-width="2"/><path d="M40 78V103M29 87H51" stroke="${dark}" stroke-width="4"/>`;
    else subject += `<path d="M123 94L138 22L145 14L146 25L130 96Z" fill="${bright}" stroke="${light}" stroke-width="2"/><path d="M118 92L138 96" stroke="#cea75d" stroke-width="5"/>`;
  }
  const rays = Array.from({length: 11}, (_, i) => `<path d="M80 75L${(seed + i * 61) % 160} 0"/>`).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120"><defs><radialGradient id="b"><stop stop-color="${light}"/><stop offset="1" stop-color="${dark}"/></radialGradient></defs><rect width="160" height="120" fill="#141d29"/><circle cx="80" cy="52" r="77" fill="url(#b)" opacity=".65"/><g stroke="${bright}" opacity=".09" stroke-width="11">${rays}</g><path d="M0 102L16 96L27 105L43 98L66 110L88 101L112 108L142 97L160 105V120H0Z" fill="#111923"/>${subject}<path d="M0 118H160" stroke="${bright}" opacity=".35" stroke-width="3"/></svg>`;
  fs.writeFileSync(path.join(__dirname, `${c.id}.svg`), svg);
}
