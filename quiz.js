'use strict';
// 出題の共通部分：1画面に1問、選択式／数字入力、正誤の表示
// 問題の形：
//   数の問題   { kind:'number', text, answer, unit, choiceStyle, category:{ja,id}, explain }
//   図形の問題 { kind:'figure', grid, options, answerIndex, category, explain }

const MODE_KEY = 'mathiq-input-mode';
const MODE_LABELS = {
  choice: { ja: '選択', id: 'Pilihan' },
  number: { ja: '数字', id: 'Angka' }
};

const Q = { test: null, questions: [], idx: 0, records: [], mode: 'choice', startAt: 0, locked: false, timer: null, typed: '' };

function loadMode() {
  try { return localStorage.getItem(MODE_KEY); } catch (e) { return null; }
}
function saveMode(m) {
  try { localStorage.setItem(MODE_KEY, m); } catch (e) { /* 保存できなくても続ける */ }
}

function startQuiz(testKey) {
  const test = TESTS[testKey];
  Q.test = test;
  Q.testKey = testKey;
  Q.questions = test.build();
  Q.idx = 0;
  Q.records = [];
  Q.startAt = Date.now();
  const saved = loadMode();
  Q.mode = test.modes.indexOf(saved) >= 0 ? saved : test.modes[0];
  renderModeSwitch();
  showScreen('quiz');
  showQuestion();
}

function stopQuiz() {
  clearTimeout(Q.timer);
  Q.locked = true;
}

function renderModeSwitch() {
  const box = document.getElementById('mode-switch');
  box.innerHTML = '';
  box.hidden = Q.test.modes.length < 2;
  Q.test.modes.forEach(m => {
    const b = biEl('button', 'mode-btn' + (m === Q.mode ? ' on' : ''), MODE_LABELS[m].ja, MODE_LABELS[m].id);
    b.addEventListener('click', () => {
      if (Q.locked || m === Q.mode) return;
      Q.mode = m;
      saveMode(m);
      renderModeSwitch();
      renderInput();
    });
    box.appendChild(b);
  });
}

function currentQ() {
  return Q.questions[Q.idx];
}

function showQuestion() {
  const q = currentQ();
  Q.locked = false;
  Q.typed = '';
  document.getElementById('quiz-progress').textContent = (Q.idx + 1) + ' / ' + Q.questions.length;
  document.getElementById('quiz-feedback').innerHTML = '';
  const p = document.getElementById('quiz-prompt');
  p.innerHTML = '';
  if (q.kind === 'figure') {
    p.appendChild(biEl('p', 'prompt-note', '「?」に入る図形は？', 'Gambar apa yang cocok untuk "?"'));
    p.appendChild(matrixEl(q.grid));
  } else {
    if (q.note) p.appendChild(biEl('p', 'prompt-note', q.note.ja, q.note.id));
    p.appendChild(el('p', 'prompt-text', q.text));
  }
  renderInput();
}

function renderInput() {
  const box = document.getElementById('quiz-input');
  box.innerHTML = '';
  const q = currentQ();
  if (q.kind === 'figure') {
    const grid = el('div', 'choices fig-choices');
    q.options.forEach((spec, i) => {
      const b = el('button', 'choice-btn');
      b.appendChild(figureSvg(spec, 90));
      b.addEventListener('click', () => submit(i, b));
      grid.appendChild(b);
    });
    box.appendChild(grid);
  } else if (Q.mode === 'choice') {
    if (!q.choices) q.choices = makeNumberChoices(q.answer, q.choiceStyle);
    const grid = el('div', 'choices');
    q.choices.forEach(v => {
      const b = el('button', 'choice-btn', fmt(v) + (q.unit ? ' ' + q.unit : ''));
      b.addEventListener('click', () => submit(v, b));
      grid.appendChild(b);
    });
    box.appendChild(grid);
  } else {
    renderNumpad(box, q);
  }
}

function renderNumpad(box, q) {
  const disp = el('div', 'num-display');
  const val = el('span', 'num-value', '');
  disp.appendChild(val);
  if (q.unit) disp.appendChild(el('span', 'num-unit', q.unit));
  box.appendChild(disp);

  const pad = el('div', 'numpad');
  const keys = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '.', '0', '⌫'];
  keys.forEach(k => {
    const b = el('button', 'key', k);
    b.addEventListener('click', () => {
      if (Q.locked) return;
      if (k === '⌫') Q.typed = Q.typed.slice(0, -1);
      else if (Q.typed.length >= 9) return;
      else if (k === '.') {
        if (Q.typed.indexOf('.') >= 0) return;
        Q.typed = (Q.typed === '' ? '0' : Q.typed) + '.';
      } else Q.typed += k;
      val.textContent = Q.typed;
    });
    pad.appendChild(b);
  });
  box.appendChild(pad);

  const ok = biEl('button', 'answer-btn', '答える', 'Jawab');
  ok.addEventListener('click', () => {
    if (Q.typed === '' || Q.typed === '0.') return;
    submit(parseFloat(Q.typed), null);
  });
  box.appendChild(ok);
  box.appendChild(biEl('p', 'hint', '小数点は「.」を使います', 'Tanda desimal memakai titik (.)'));
}

function submit(value, btn) {
  if (Q.locked) return;
  Q.locked = true;
  const q = currentQ();
  const correct = q.kind === 'figure' ? value === q.answerIndex : sameNum(value, q.answer);
  Q.records.push({ q: q, correct: correct, given: value, mode: q.kind === 'figure' ? 'choice' : Q.mode });
  if (btn) btn.classList.add(correct ? 'right' : 'wrong');

  const fb = document.getElementById('quiz-feedback');
  fb.innerHTML = '';
  if (correct) {
    fb.appendChild(biEl('p', 'fb-right', '○ 正解', 'Benar'));
    Q.timer = setTimeout(nextQuestion, 700);
    return;
  }
  const line = biEl('p', 'fb-wrong', '× 不正解', 'Salah');
  fb.appendChild(line);
  const ans = el('div', 'fb-answer');
  ans.appendChild(biEl('span', 'fb-label', '正解', 'Jawaban'));
  ans.appendChild(answerNode(q));
  fb.appendChild(ans);
  if (q.explain) fb.appendChild(biEl('p', 'fb-explain', q.explain.ja, q.explain.id));
  const next = biEl('button', 'answer-btn', '次へ', 'Lanjut');
  next.addEventListener('click', nextQuestion);
  fb.appendChild(next);
  next.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 正解の表示（数なら文字、図形なら絵）
function answerNode(q) {
  if (q.kind === 'figure') return figureSvg(q.options[q.answerIndex], 60);
  return el('span', 'fb-value', fmt(q.answer) + (q.unit ? ' ' + q.unit : ''));
}

function nextQuestion() {
  clearTimeout(Q.timer);
  Q.idx++;
  if (Q.idx < Q.questions.length) showQuestion();
  else finishQuiz();
}

function finishQuiz() {
  const cats = [];
  const byName = {};
  Q.records.forEach(r => {
    const c = r.q.category;
    if (!byName[c.ja]) { byName[c.ja] = { ja: c.ja, id: c.id, score: 0, max: 0 }; cats.push(byName[c.ja]); }
    byName[c.ja].max++;
    if (r.correct) byName[c.ja].score++;
  });
  const score = Q.records.filter(r => r.correct).length;
  const modes = Array.from(new Set(Q.records.map(r => r.mode))).join('+');
  const result = makeResult(Q.testKey, Q.test.title.ja, score, Q.records.length, cats, modes,
    Math.round((Date.now() - Q.startAt) / 1000));
  const wrong = Q.records.filter(r => !r.correct).map(r => r.q);
  showResult(result, wrong, null);
}
