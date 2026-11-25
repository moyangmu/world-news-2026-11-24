// Six hand-drawn night-scene illustrations, one per story. viewBox 122 x 186.
const cream = '#F5F0E4', red = '#E23D2B', amber = '#F6B73C', green = '#2FD08A';
const slate = '#7389AB', slateDk = '#2A4067', deep = '#0C1626';

const wrap = (id, inner, extraDefs = '') => `
<svg viewBox="0 0 122 186" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg${id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1A2E52"/><stop offset="1" stop-color="#0C1626"/>
    </linearGradient>
    ${extraDefs}
  </defs>
  <rect width="122" height="186" fill="url(#bg${id})"/>
  ${inner}
</svg>`;

const bigFig = (txt, fill = cream) =>
  `<text x="61" y="173" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="38" fill="${fill}">${txt}</text>`;

const pill = (txt, kind) => {
  const w = Math.max(64, txt.length * 8.3 + 22), x = (122 - w) / 2;
  return kind === 'solid'
    ? `<rect x="${x}" y="152" width="${w}" height="25" rx="12.5" fill="${red}"/>
       <text x="61" y="169.6" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="16" letter-spacing="1.1" fill="#fff">${txt}</text>`
    : `<rect x="${x}" y="152" width="${w}" height="25" rx="12.5" fill="#0C1626" fill-opacity=".72" stroke="${amber}" stroke-width="1.8"/>
       <text x="61" y="169.6" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="16" letter-spacing="1.1" fill="${amber}">${txt}</text>`;
};

const stars = (pts) => pts.map(([x, y, r = 0.9]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#C9D6EC" opacity=".7"/>`).join('');

// 1 — chip + share price jump
const s1 = wrap(1, `
  <g transform="translate(61,50)">
    <g stroke="${cream}" stroke-width="3" stroke-linecap="round">
      ${[-15, -5, 5, 15].map((v) => `<line x1="${v}" y1="-35" x2="${v}" y2="-27"/><line x1="${v}" y1="27" x2="${v}" y2="35"/><line x1="-35" y1="${v}" x2="-27" y2="${v}"/><line x1="27" y1="${v}" x2="35" y2="${v}"/>`).join('')}
    </g>
    <rect x="-26" y="-26" width="52" height="52" rx="8" fill="#22395F" stroke="${cream}" stroke-width="3"/>
    <rect x="-14" y="-14" width="28" height="28" rx="4" fill="${green}"/>
    <path d="M-7 .5 l5 5.5 l9.5 -11" stroke="${deep}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <path d="M10 136 L26 133 L38 136 L52 130 L64 133 L76 127 L88 108 L104 98 L104 143 L10 143 Z" fill="url(#ar1)"/>
  <path d="M10 136 L26 133 L38 136 L52 130 L64 133 L76 127 L88 108 L102 99.5" stroke="${green}" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M112 93 L99 94.5 L106.5 105.5 Z" fill="${green}"/>
  ${bigFig('+30%', green)}
`, `<linearGradient id="ar1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${green}" stop-opacity=".42"/><stop offset="1" stop-color="${green}" stop-opacity="0"/></linearGradient>`);

// 2 — scales of justice + 10 of 12 counts
const s2 = wrap(2, `
  <g stroke="${cream}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <line x1="61" y1="20" x2="61" y2="76"/>
    <line x1="25" y1="29" x2="97" y2="29"/>
    <path d="M25 29 L13 55 M25 29 L37 55"/>
    <path d="M97 29 L85 55 M97 29 L109 55"/>
  </g>
  <circle cx="61" cy="19" r="5" fill="${cream}"/>
  <path d="M10 55 H40 A15 11 0 0 1 10 55 Z" fill="${cream}"/>
  <path d="M82 55 H112 A15 11 0 0 1 82 55 Z" fill="${cream}"/>
  <rect x="43" y="74" width="36" height="6" rx="3" fill="${cream}"/>
  ${Array.from({ length: 12 }, (_, i) => {
    const x = 12 + (i % 6) * 17, y = 96 + Math.floor(i / 6) * 17;
    return i < 10
      ? `<rect x="${x}" y="${y}" width="13" height="13" rx="2.5" fill="${red}"/>`
      : `<rect x="${x + 0.9}" y="${y + 0.9}" width="11.2" height="11.2" rx="2" fill="none" stroke="${cream}" stroke-width="1.8" opacity=".85"/>`;
  }).join('')}
  <text x="61" y="173" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="38"><tspan fill="${red}">10</tspan><tspan fill="${cream}">/12</tspan></text>
`);

// 3 — tanker on fire, cause unknown
const s3 = wrap(3, `
  ${stars([[12, 70], [100, 58], [86, 12, 0.7]])}
  <circle cx="54" cy="96" r="58" fill="url(#gl3)"/>
  <g fill="#3A4D70">
    <circle cx="56" cy="60" r="9"/><circle cx="66" cy="47" r="12"/><circle cx="81" cy="35" r="14"/>
    <circle cx="98" cy="24" r="15"/><circle cx="114" cy="14" r="15"/>
  </g>
  <g fill="#4A5F86"><circle cx="62" cy="50" r="6"/><circle cx="77" cy="38" r="8"/><circle cx="95" cy="26" r="9"/></g>
  <rect y="127" width="122" height="59" fill="#0B1F3A"/>
  <ellipse cx="54" cy="130" rx="40" ry="5" fill="${amber}" opacity=".3"/>
  <rect x="93" y="74" width="7" height="12" fill="${slate}"/><rect x="93" y="77" width="7" height="3.5" fill="${red}"/>
  <rect x="87" y="85" width="18" height="19" rx="1.5" fill="${cream}"/>
  <rect x="89.5" y="89" width="13" height="3.2" fill="${deep}"/>
  <path d="M6 103 L22 103 L26 110 L84 110 L84 103 L115 103 L109 127 L18 127 Z" fill="${slate}"/>
  <path d="M14.5 120 L110.7 120 L109 127 L18 127 Z" fill="#B53425"/>
  <path d="M30 107 H78" stroke="${cream}" stroke-width="1.6" opacity=".7"/>
  <path d="M36 110 C29 97 40 91 41 79 C47 86 50 80 52 67 C60 79 69 86 64 98 C70 94 71 104 68 110 Z" fill="${red}"/>
  <path d="M42 110 C39 100 46 96 47 88 C51 94 54 91 55 83 C60 93 63 100 60 110 Z" fill="${amber}"/>
  <path d="M48 110 C47 104 51 102 52 96 C55 101 57 105 56 110 Z" fill="#FFF0BF"/>
  <g stroke="#3D5C8C" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".9">
    <path d="M6 137 q5 -3.5 10 0 t10 0"/><path d="M84 139 q5 -3.5 10 0 t10 0 t10 0"/><path d="M40 145 q5 -3.5 10 0 t10 0"/>
  </g>
  <circle cx="26" cy="36" r="16" fill="#0C1626" fill-opacity=".55" stroke="${amber}" stroke-width="2" stroke-dasharray="4.2 3.6"/>
  <text x="26" y="45" text-anchor="middle" font-family="Barlow Condensed" font-weight="700" font-size="26" fill="${amber}">?</text>
  ${pill('UNCONFIRMED')}
`, `<radialGradient id="gl3"><stop offset="0" stop-color="#FF8A3C" stop-opacity=".5"/><stop offset="1" stop-color="#FF8A3C" stop-opacity="0"/></radialGradient>`);

// 4 — drone diving on a ship in port
const s4 = wrap(4, `
  ${stars([[70, 16], [100, 30], [12, 76], [84, 44, 0.7]])}
  <rect y="128" width="122" height="58" fill="#0B1F3A"/>
  <g stroke="#4D6A9A" stroke-width="3" stroke-linecap="round" fill="none">
    <line x1="107" y1="62" x2="107" y2="120"/><line x1="107" y1="66" x2="80" y2="54"/><line x1="107" y1="66" x2="118" y2="60"/>
    <line x1="107" y1="58" x2="92" y2="59.5" stroke-width="1.6"/><line x1="84" y1="56" x2="84" y2="76" stroke-width="1.6"/>
  </g>
  <rect x="96" y="118" width="26" height="68" fill="#34507E"/>
  <circle cx="38" cy="106" r="34" fill="url(#gl4)"/>
  <rect x="62" y="88" width="14" height="9" fill="#C8D2E3"/>
  <path d="M69 88 V73 M69 74 L62 88 M69 74 L76 88" stroke="${cream}" stroke-width="1.8" stroke-linecap="round" fill="none"/><circle cx="69" cy="71.5" r="2" fill="${red}"/>
  <rect x="54" y="97" width="28" height="15" rx="1.5" fill="${cream}"/>
  <rect x="57" y="101" width="22" height="3.2" fill="${deep}"/>
  <path d="M8 112 L92 112 L88 128 L19 128 Z" fill="${slate}"/>
  <path d="M15 122 L89.5 122 L88 128 L19 128 Z" fill="#B53425"/>
  <path d="M38 88 l4 10 l10 -5 l-4 10 l10 5 l-11 3 l2 11 l-9 -7 l-8 8 l1 -11 l-11 -2 l9 -6 l-6 -10 l11 4 Z" fill="${red}"/>
  <path d="M38 96 l2.5 6 l6.5 -2.5 l-3 6 l6 3.5 l-7 1.5 l1 6.5 l-5.5 -4.5 l-5 5 l.8 -6.8 l-6.8 -1.4 l5.6 -3.8 l-3.4 -6 l6.6 2.6 Z" fill="${amber}"/>
  <path d="M38 34 Q58 62 41 90" stroke="${amber}" stroke-width="2" stroke-dasharray="3.5 4.5" fill="none" stroke-linecap="round"/>
  <g transform="translate(30,26) rotate(52)" fill="${cream}">
    <rect x="-18" y="-3.2" width="36" height="6.4" rx="3.2"/>
    <rect x="-5" y="-23" width="7.5" height="46" rx="3"/>
    <rect x="-18.5" y="-9" width="4.5" height="18" rx="2.2"/>
    <circle cx="17" cy="0" r="2.4" fill="${red}"/>
  </g>
  <g stroke="#3D5C8C" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".9">
    <path d="M6 138 q5 -3.5 10 0 t10 0"/><path d="M52 141 q5 -3.5 10 0 t10 0 t10 0"/>
  </g>
  ${pill('CLAIMED')}
`, `<radialGradient id="gl4"><stop offset="0" stop-color="#FF8A3C" stop-opacity=".5"/><stop offset="1" stop-color="#FF8A3C" stop-opacity="0"/></radialGradient>`);

// 5 — closed border crossing
const s5 = wrap(5, `
  ${stars([[14, 18], [104, 26], [92, 58, 0.7], [30, 60, 0.7]])}
  <g fill="#2C4672">
    <path d="M0 132 V84 h4 v-5 h4 v5 h4 v-5 h4 v5 h4 V132 Z"/>
    <path d="M98 132 V74 h4 v-5 h4 v5 h4 v-5 h4 v5 h4 v-5 h4 V132 Z"/>
  </g>
  <rect y="132" width="122" height="54" fill="#0A1322"/>
  <path d="M44 132 H78 L104 186 H18 Z" fill="#1B2D4B"/>
  <path d="M61 136 V150" stroke="${cream}" stroke-width="2" stroke-dasharray="5 5" opacity=".55"/>
  <line x1="61" y1="62" x2="61" y2="104" stroke="${slate}" stroke-width="3.2"/>
  <circle cx="61" cy="44" r="21" fill="${red}" stroke="${cream}" stroke-width="2.6"/>
  <rect x="47" y="39.5" width="28" height="9" rx="1.6" fill="${cream}"/>
  <rect x="104" y="100" width="5.5" height="34" rx="1" fill="${slate}"/>
  <rect x="12" y="102" width="100" height="10" rx="2.2" fill="url(#st5)" stroke="${deep}" stroke-width=".8"/>
  <rect x="10" y="94" width="11" height="40" rx="1.6" fill="${cream}"/>
  <circle cx="15.5" cy="107" r="2.6" fill="${deep}"/>
  ${pill('FROM 1 DEC', 'solid')}
`, `<pattern id="st5" width="20" height="10" patternUnits="userSpaceOnUse" patternTransform="skewX(-28)"><rect width="10" height="10" fill="${red}"/><rect x="10" width="10" height="10" fill="${cream}"/></pattern>`);

// 6 — airstrike over a city block
const s6 = wrap(6, `
  ${stars([[14, 22], [40, 12, 0.7], [20, 58, 0.7]])}
  <circle cx="70" cy="104" r="52" fill="url(#gl6)"/>
  <g fill="#4B6088">
    <circle cx="70" cy="82" r="10"/><circle cx="62" cy="66" r="12"/><circle cx="72" cy="50" r="13"/>
    <circle cx="60" cy="33" r="14"/><circle cx="70" cy="15" r="15"/>
  </g>
  <g fill="#6079A6"><circle cx="66" cy="72" r="6"/><circle cx="68" cy="54" r="8"/><circle cx="62" cy="36" r="8"/></g>
  <path d="M116 8 L80 84" stroke="url(#tr6)" stroke-width="3" stroke-linecap="round"/>
  <g fill="#22385C">
    <rect x="24" y="96" width="18" height="46"/><rect x="88" y="90" width="16" height="52"/>
  </g>
  <g fill="#35507C">
    <rect x="4" y="108" width="22" height="34"/><rect x="40" y="114" width="18" height="28"/>
    <rect x="58" y="100" width="24" height="42"/><rect x="100" y="110" width="20" height="32"/>
    <rect x="9" y="102" width="7" height="6"/><rect x="104" y="104" width="7" height="6"/>
  </g>
  <g fill="${amber}" opacity=".85">
    <rect x="8" y="114" width="4" height="4"/><rect x="17" y="124" width="4" height="4"/><rect x="28" y="104" width="4" height="4"/>
    <rect x="45" y="122" width="4" height="4"/><rect x="92" y="98" width="4" height="4"/><rect x="92" y="114" width="4" height="4"/>
    <rect x="106" y="118" width="4" height="4"/><rect x="112" y="128" width="4" height="4"/>
  </g>
  <path d="M70 80 l4 11 l11 -5 l-5 11 l11 5 l-12 3 l2 12 l-10 -8 l-9 9 l1 -12 l-12 -2 l10 -7 l-7 -11 l12 5 Z" fill="${red}"/>
  <path d="M70 89 l2.6 6.6 l7 -3 l-3.2 6.6 l6.6 3.6 l-7.6 1.6 l1.2 7 l-6 -4.8 l-5.6 5.4 l.8 -7.4 l-7.4 -1.4 l6 -4.2 l-3.8 -6.6 l7.2 2.8 Z" fill="${amber}"/>
  <g stroke="${cream}" stroke-width="2.2" fill="none" stroke-linecap="round">
    <circle cx="70" cy="100" r="25"/>
    <path d="M70 68 V80 M70 120 V132 M38 100 H50 M90 100 H102"/>
  </g>
  <rect y="142" width="122" height="44" fill="#0A1322"/>
  ${pill('AIRSTRIKE', 'solid')}
`, `<radialGradient id="gl6"><stop offset="0" stop-color="#FF8A3C" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A3C" stop-opacity="0"/></radialGradient>
   <linearGradient id="tr6" gradientUnits="userSpaceOnUse" x1="116" y1="8" x2="80" y2="84"><stop offset="0" stop-color="${cream}" stop-opacity="0"/><stop offset="1" stop-color="${cream}" stop-opacity=".95"/></linearGradient>`);

export const scenes = [s1, s2, s3, s4, s5, s6];
