'use strict';
// data-*.js から問題を作る（計算・単位換算は自動生成）

const OP_INFO = {
  '+': { show: '+', cat: { ja: 'たし算', id: 'Penjumlahan' } },
  '-': { show: '−', cat: { ja: 'ひき算', id: 'Pengurangan' } },
  '×': { show: '×', cat: { ja: 'かけ算', id: 'Perkalian' } },
  '÷': { show: '÷', cat: { ja: 'わり算', id: 'Pembagian' } }
};

function buildArithmetic(cfg) {
  const qs = [];
  for (let i = 0; i < cfg.count; i++) {
    const r = cfg.ops[i % cfg.ops.length];
    let a, b, ans;
    if (r.op === '÷') {
      b = randInt(r.b[0], r.b[1]);
      ans = randInt(r.answer[0], r.answer[1]);
      a = ans * b;
    } else {
      a = randInt(r.a[0], r.a[1]);
      b = randInt(r.b[0], r.b[1]);
      if (r.op === '-' && a < b) [a, b] = [b, a];
      ans = r.op === '+' ? a + b : r.op === '-' ? a - b : a * b;
    }
    const info = OP_INFO[r.op];
    qs.push({ kind: 'number', text: a + ' ' + info.show + ' ' + b + ' = ?', answer: ans, choiceStyle: 'near', category: info.cat });
  }
  return shuffle(qs);
}

const DIR_CAT = {
  down: { ja: '大きい単位 → 小さい単位', id: 'Ke satuan lebih kecil' },
  up:   { ja: '小さい単位 → 大きい単位', id: 'Ke satuan lebih besar' }
};

// 換算する数を作る（小さい整数・大きい整数・小数1桁）
function unitValue() {
  const r = Math.random();
  if (r < 0.5) return randInt(1, 99);
  if (r < 0.8) return randInt(100, 9999);
  return randInt(11, 99) / 10;
}

function buildUnits(cfg) {
  const qs = [];
  for (let i = 0; i < cfg.count; i++) {
    const g = pick(cfg.groups);
    for (let t = 0; t < 200; t++) {
      const pair = shuffle(g.units).slice(0, 2);
      const from = pair[0], to = pair[1];
      const value = unitValue();
      const ans = Number(fmt(value * Math.pow(10, from.exp - to.exp)));
      if (decimals(ans) > cfg.maxDecimals || ans > cfg.maxAnswer || ans <= 0) continue;
      qs.push({
        kind: 'number',
        text: fmt(value) + ' ' + from.u + ' = ? ' + to.u,
        answer: ans,
        unit: to.u,
        choiceStyle: 'unit',
        category: from.exp > to.exp ? DIR_CAT.down : DIR_CAT.up
      });
      break;
    }
  }
  return qs;
}

// 数列：問題集から count 問をばらばらに選ぶ
function buildSequences(data) {
  return shuffle(data.questions).slice(0, data.count).map(d => ({
    kind: 'number',
    text: d.seq.map(v => (v === null ? '?' : v)).join(',  '),
    note: { ja: '「?」に入る数は？', id: 'Angka apa yang cocok untuk "?"' },
    answer: d.answer,
    choiceStyle: 'near',
    category: data.categories[d.cat],
    explain: d.explain
  }));
}

// 図形：正解とまちがいの選択肢をまぜる
function buildFigures(data) {
  return shuffle(data.questions).slice(0, data.count).map(d => {
    const options = shuffle([d.answer].concat(d.wrong));
    return {
      kind: 'figure',
      grid: d.grid,
      options: options,
      answerIndex: options.indexOf(d.answer),
      category: data.categories[d.cat],
      explain: d.explain
    };
  });
}
