'use strict';
// 図形を描く。図形は「形 数 色 向き」の文字で指定する
//   形：circle（丸） square（四角） triangle（三角） diamond（ひし形） arrow（矢印）
//   数：1〜4   色：black / gray / white   向き：0 / 90 / 180 / 270（時計回り、省略可）
//   例：'triangle 3 black'  'arrow 1 white 90'

const SVG_NS = 'http://www.w3.org/2000/svg';
const FIG_FILL = { black: '#1f2933', gray: '#9aa5b1', white: '#ffffff' };
const FIG_POS = {
  1: [[50, 50]],
  2: [[28, 50], [72, 50]],
  3: [[50, 27], [27, 71], [73, 71]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]]
};
const FIG_R = { 1: 32, 2: 19, 3: 17, 4: 17 };

function parseFig(str) {
  const p = str.trim().split(/\s+/);
  return { shape: p[0], n: Number(p[1] || 1), fill: p[2] || 'black', rot: Number(p[3] || 0) };
}

function svgEl(tag, attrs) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}

function points(list, r) {
  return list.map(p => (p[0] * r).toFixed(1) + ',' + (p[1] * r).toFixed(1)).join(' ');
}

function shapeEl(shape, r) {
  switch (shape) {
    case 'circle':   return svgEl('circle', { cx: 0, cy: 0, r: r * 0.85 });
    case 'square':   return svgEl('rect', { x: -r * 0.75, y: -r * 0.75, width: r * 1.5, height: r * 1.5 });
    case 'triangle': return svgEl('polygon', { points: points([[0, -1], [0.9, 0.7], [-0.9, 0.7]], r) });
    case 'diamond':  return svgEl('polygon', { points: points([[0, -1], [0.75, 0], [0, 1], [-0.75, 0]], r) });
    case 'arrow':    return svgEl('polygon', { points: points([[0, -1], [0.75, -0.1], [0.3, -0.1], [0.3, 1], [-0.3, 1], [-0.3, -0.1], [-0.75, -0.1]], r) });
    default:         return null;
  }
}

// 1マス分の図形（SVG）を作る
function figureSvg(str, size) {
  const f = parseFig(str);
  const svg = svgEl('svg', { viewBox: '0 0 100 100', width: size, height: size, role: 'img', 'aria-label': str });
  const r = FIG_R[f.n];
  (FIG_POS[f.n] || []).forEach(pos => {
    const s = shapeEl(f.shape, r);
    if (!s) return;
    s.setAttribute('fill', FIG_FILL[f.fill] || FIG_FILL.black);
    s.setAttribute('stroke', '#1f2933');
    s.setAttribute('stroke-width', 3);
    s.setAttribute('stroke-linejoin', 'round');
    const g = svgEl('g', { transform: 'translate(' + pos[0] + ' ' + pos[1] + ') rotate(' + f.rot + ')' });
    g.appendChild(s);
    svg.appendChild(g);
  });
  return svg;
}

// 3×3 のマス（9マス目は「?」）
function matrixEl(cells) {
  const grid = el('div', 'matrix');
  cells.forEach(c => {
    const cell = el('div', 'cell');
    cell.appendChild(figureSvg(c, 80));
    grid.appendChild(cell);
  });
  grid.appendChild(el('div', 'cell q', '?'));
  return grid;
}
