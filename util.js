'use strict';
// 共通の小さな道具（乱数・数の表示・画面部品）

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

// 並びをばらばらにした新しい配列を返す
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 小数の誤差を消して文字にする（例：7599.9999999 → "7600"）
function fmt(n) {
  return String(Number(n.toFixed(6)));
}

function sameNum(a, b) {
  return Math.abs(a - b) < 1e-6;
}

// 小数点以下の桁数
function decimals(n) {
  const s = fmt(n);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

// 数の答えに対して、まぎらわしい選択肢を3つ作り、正解と合わせて4つ返す
// style 'unit'：桁のずれ（×10、÷10 など） / 'near'：近い数（±1、±10 など）
function makeNumberChoices(answer, style) {
  let cands;
  if (style === 'unit') {
    cands = shuffle([answer * 10, answer / 10, answer * 100, answer / 100])
      .concat([answer * 1000, answer / 1000]);
  } else {
    cands = shuffle([answer + 1, answer - 1, answer + 2, answer - 2, answer + 10, answer - 10]);
  }
  const seen = new Set([fmt(answer)]);
  const out = [Number(fmt(answer))];
  for (const c of cands) {
    if (out.length >= 4) break;
    const s = fmt(c);
    if (c >= 0 && !seen.has(s)) { seen.add(s); out.push(Number(s)); }
  }
  for (let k = 3; out.length < 4; k++) {
    const s = fmt(answer + k);
    if (!seen.has(s)) { seen.add(s); out.push(Number(s)); }
  }
  return shuffle(out);
}

// 画面部品：要素を作る
function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

// 日本語＋インドネシア語（下に小さく）の要素を作る
function biEl(tag, cls, ja, id) {
  const e = el(tag, cls, ja);
  if (id) e.appendChild(el('span', 'id', id));
  return e;
}
