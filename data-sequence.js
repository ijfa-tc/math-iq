// 数列の問題。null が「?」の場所です。毎回 count 問をばらばらに出します。
// 問題を足すときは questions に1行足すだけ。cat は categories の名前を使います。
const SEQUENCE_DATA = {
  count: 10,
  categories: {
    add:  { ja: 'たし算・ひき算の規則', id: 'Pola tambah / kurang' },
    mul:  { ja: 'かけ算・わり算の規則', id: 'Pola kali / bagi' },
    diff: { ja: '増え方が変わる', id: 'Selisih berubah' },
    two:  { ja: '2つの規則', id: 'Dua aturan' }
  },
  questions: [
    { cat: 'add',  seq: [3, 7, 11, 15, null],     answer: 19,  explain: { ja: '+4 ずつ増える', id: 'Bertambah 4' } },
    { cat: 'add',  seq: [50, 44, 38, 32, null],   answer: 26,  explain: { ja: '−6 ずつ減る', id: 'Berkurang 6' } },
    { cat: 'add',  seq: [4, null, 12, 16, 20],    answer: 8,   explain: { ja: '+4 ずつ増える', id: 'Bertambah 4' } },
    { cat: 'add',  seq: [7, 14, 21, 28, null],    answer: 35,  explain: { ja: '+7 ずつ増える', id: 'Bertambah 7' } },
    { cat: 'mul',  seq: [3, 6, 12, 24, null],     answer: 48,  explain: { ja: '×2 ずつ', id: 'Dikali 2' } },
    { cat: 'mul',  seq: [81, 27, 9, 3, null],     answer: 1,   explain: { ja: '÷3 ずつ', id: 'Dibagi 3' } },
    { cat: 'mul',  seq: [2, 10, 50, null],        answer: 250, explain: { ja: '×5 ずつ', id: 'Dikali 5' } },
    { cat: 'diff', seq: [1, 2, 4, 7, 11, null],   answer: 16,  explain: { ja: '+1, +2, +3, +4, +5', id: '+1, +2, +3, +4, +5' } },
    { cat: 'diff', seq: [100, 90, 81, 73, null],  answer: 66,  explain: { ja: '−10, −9, −8, −7', id: '−10, −9, −8, −7' } },
    { cat: 'diff', seq: [1, 4, 9, 16, null],      answer: 25,  explain: { ja: '+3, +5, +7, +9（1×1, 2×2, 3×3 …）', id: '+3, +5, +7, +9 (1×1, 2×2, 3×3 …)' } },
    { cat: 'diff', seq: [1, 1, 2, 3, 5, 8, null], answer: 13,  explain: { ja: '前の2つをたす（5 + 8）', id: 'Jumlah dua angka sebelumnya (5 + 8)' } },
    { cat: 'two',  seq: [5, 8, 7, 10, 9, null],   answer: 12,  explain: { ja: '+3, −1 をくり返す', id: '+3, −1 berulang' } },
    { cat: 'two',  seq: [1, 10, 2, 20, 3, null],  answer: 30,  explain: { ja: '1つおきに 1, 2, 3 と 10, 20, 30', id: 'Selang-seling: 1, 2, 3 dan 10, 20, 30' } },
    { cat: 'two',  seq: [2, 5, 11, 23, null],     answer: 47,  explain: { ja: '×2 して +1', id: 'Dikali 2, lalu tambah 1' } }
  ]
};
