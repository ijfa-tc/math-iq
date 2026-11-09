'use strict';
// 連続たし算（クレペリン検査型）：となりの2つの数をたし、一の位だけを答える

const KR = { digits: [], i: 0, running: false, timer: null, endAt: 0, startAt: 0, half: [], flashTimer: null };

function openKraepelin() {
  stopKraepelin();
  document.getElementById('kr-intro').hidden = false;
  document.getElementById('kr-play').hidden = true;
  document.getElementById('kr-timer').textContent = '';
  showScreen('kraepelin');
}

function stopKraepelin() {
  KR.running = false;
  clearInterval(KR.timer);
  clearTimeout(KR.flashTimer);
}

function krAddDigits(n) {
  const cfg = CALC_DATA.kraepelin;
  for (let k = 0; k < n; k++) KR.digits.push(randInt(cfg.digitMin, cfg.digitMax));
}

function krStart() {
  const sec = CALC_DATA.kraepelin.seconds;
  KR.digits = [];
  krAddDigits(50);
  KR.i = 0;
  KR.half = [{ score: 0, max: 0 }, { score: 0, max: 0 }];
  KR.startAt = Date.now();
  KR.endAt = KR.startAt + sec * 1000;
  KR.running = true;
  document.getElementById('kr-intro').hidden = true;
  document.getElementById('kr-play').hidden = false;
  krRender();
  krTick();
  KR.timer = setInterval(krTick, 200);
}

function krTick() {
  const left = Math.max(0, Math.ceil((KR.endAt - Date.now()) / 1000));
  document.getElementById('kr-timer').textContent = '残り / Sisa ' + left + ' 秒';
  if (left <= 0) krFinish();
}

// 数字の列を表示（今の2つを強調）
function krRender() {
  const strip = document.getElementById('kr-strip');
  strip.innerHTML = '';
  for (let k = KR.i - 1; k <= KR.i + 5; k++) {
    const cls = k === KR.i || k === KR.i + 1 ? 'kr-d now' : 'kr-d';
    strip.appendChild(el('span', cls, k >= 0 ? String(KR.digits[k]) : ''));
  }
}

function krInput(d) {
  if (!KR.running) return;
  const correct = (KR.digits[KR.i] + KR.digits[KR.i + 1]) % 10 === d;
  const sec = CALC_DATA.kraepelin.seconds;
  const h = (Date.now() - KR.startAt) < sec * 500 ? 0 : 1;
  KR.half[h].max++;
  if (correct) KR.half[h].score++;
  KR.i++;
  if (KR.i + 7 >= KR.digits.length) krAddDigits(50);
  krRender();
  const strip = document.getElementById('kr-strip');
  strip.classList.remove('ok', 'ng');
  strip.classList.add(correct ? 'ok' : 'ng');
  clearTimeout(KR.flashTimer);
  KR.flashTimer = setTimeout(() => strip.classList.remove('ok', 'ng'), 150);
}

function krFinish() {
  stopKraepelin();
  const sec = CALC_DATA.kraepelin.seconds;
  const cats = [
    { ja: '前半', id: 'Babak pertama', score: KR.half[0].score, max: KR.half[0].max },
    { ja: '後半', id: 'Babak kedua', score: KR.half[1].score, max: KR.half[1].max }
  ];
  const score = cats[0].score + cats[1].score;
  const max = cats[0].max + cats[1].max;
  const result = makeResult('kraepelin', '連続たし算', score, max, cats, 'number', sec);
  const note = { ja: '「/」の右は答えた数、左は正解の数です。後半も前半と同じくらいできると◎', id: 'Kanan "/" = jumlah dijawab, kiri = jumlah benar. Bagus jika babak kedua sama baiknya dengan babak pertama.' };
  showResult(result, [], note, cats);
}

// 数字キー（0〜9）
(function setupKraepelin() {
  const pad = document.getElementById('kr-keys');
  ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0'].forEach(k => {
    const b = el('button', 'key' + (k === '0' ? ' wide' : ''), k);
    b.addEventListener('click', () => krInput(Number(k)));
    pad.appendChild(b);
  });
  document.getElementById('kr-start').addEventListener('click', krStart);
})();
