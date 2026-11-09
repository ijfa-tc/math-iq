'use strict';

// 生徒IDの形式：拠点3文字＋期生2桁＋連番3桁（例：JKT16001）
const ID_PATTERN = /^[A-Z]{3}[0-9]{5}$/;

// URLの ?id= から生徒IDを読む。形式が正しくなければ空（＝練習モード）
function getStudentId() {
  const params = new URLSearchParams(window.location.search);
  const raw = (params.get('id') || '').trim().toUpperCase();
  return ID_PATTERN.test(raw) ? raw : '';
}

const STUDENT_ID = getStudentId();

// 練習の一覧。modes の1つ目が最初の入力方法
const TESTS = {
  kraepelin:  { title: { ja: '連続たし算', id: 'Penjumlahan beruntun' } }, // 専用画面（kraepelin.js）
  arithmetic: { title: { ja: '四則計算', id: 'Operasi hitung' }, modes: ['choice', 'number'], build: () => buildArithmetic(CALC_DATA.arithmetic) },
  units:      { title: { ja: '単位換算', id: 'Konversi satuan' }, modes: ['choice', 'number'], build: () => buildUnits(CALC_DATA.units) },
  sequence:   { title: { ja: '数列', id: 'Deret angka' }, modes: ['choice', 'number'], build: () => buildSequences(SEQUENCE_DATA) },
  figure:     { title: { ja: '図形の規則', id: 'Pola gambar' }, modes: ['choice'], build: () => buildFigures(FIGURE_DATA) }
};

let lastTestKey = null;

// 画面の切り替え（home / quiz / kraepelin / result）
function showScreen(name) {
  document.querySelectorAll('main > section').forEach(s => { s.hidden = s.id !== 'screen-' + name; });
  window.scrollTo(0, 0);
}

function openTest(key) {
  lastTestKey = key;
  if (key === 'kraepelin') openKraepelin();
  else startQuiz(key);
}

function goHome() {
  stopQuiz();
  stopKraepelin();
  showScreen('home');
}

// 結果1回分の記録（将来、GASで「IJFA テスト結果DB」に送る形）
function makeResult(testId, testName, score, maxScore, categories, inputMode, seconds) {
  return {
    takenAt: new Date().toISOString(), // 受験日時（世界標準時）
    studentId: STUDENT_ID,             // 空なら練習モード
    testId: testId,
    testName: testName,
    score: score,
    maxScore: maxScore,
    categories: categories.map(c => ({ name: c.ja, score: c.score, max: c.max })),
    inputMode: inputMode,
    seconds: seconds
  };
}

// 結果画面。wrong：間違えた問題の一覧、note：ひとこと（{ja,id}）
function showResult(result, wrong, note, cats) {
  window.lastResult = result; // 送信機能を作るまでの確認用
  const t = TESTS[result.testId] || { title: { ja: result.testName, id: '' } };
  const head = document.getElementById('res-title');
  head.innerHTML = '';
  head.appendChild(biEl('span', '', t.title.ja, t.title.id));
  document.getElementById('res-score').textContent = result.score + ' / ' + result.maxScore;
  document.getElementById('res-time').textContent = '時間 / Waktu：' + result.seconds + ' 秒 / detik';

  const tbl = document.getElementById('res-cats');
  tbl.innerHTML = '';
  result.categories.forEach((c, i) => {
    const tr = el('tr');
    const label = cats ? cats[i] : findCat(c.name);
    tr.appendChild(biEl('td', '', label.ja, label.id));
    tr.appendChild(el('td', 'num', c.score + ' / ' + c.max));
    tbl.appendChild(tr);
  });

  const noteBox = document.getElementById('res-note');
  noteBox.innerHTML = '';
  if (note) noteBox.appendChild(biEl('p', '', note.ja, note.id));

  const rev = document.getElementById('res-review');
  rev.innerHTML = '';
  if (wrong.length > 0) {
    rev.appendChild(biEl('h2', '', '間違えた問題', 'Soal yang salah'));
    wrong.forEach(q => {
      const row = el('div', 'review-row');
      if (q.kind === 'figure') row.appendChild(biEl('span', 'review-q', '図形', 'Gambar'));
      else row.appendChild(el('span', 'review-q', q.text));
      row.appendChild(el('span', 'review-arrow', '→'));
      row.appendChild(answerNode(q));
      rev.appendChild(row);
    });
  }
  showScreen('result');
}

// 分野名（日本語）からインドネシア語を探す
function findCat(ja) {
  const r = Q.records.find(x => x.q.category.ja === ja);
  return r ? r.q.category : { ja: ja, id: '' };
}

// ホーム画面にIDの状態を表示する
function showStudentStatus() {
  const s = document.getElementById('student-status');
  if (STUDENT_ID) s.textContent = '生徒ID / ID Siswa：' + STUDENT_ID;
  else s.textContent = '練習モード（IDなし） / Mode latihan (tanpa ID)';
}

// ボタンの設定
document.querySelectorAll('[data-test]').forEach(b => {
  b.addEventListener('click', () => openTest(b.dataset.test));
});
document.querySelectorAll('[data-home]').forEach(b => b.addEventListener('click', goHome));
document.getElementById('res-retry').addEventListener('click', () => openTest(lastTestKey));

showStudentStatus();
showScreen('home');
