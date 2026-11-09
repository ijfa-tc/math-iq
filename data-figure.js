// 図形の規則の問題（3×3 のマス）。毎回 count 問をばらばらに出します。
// 図形の書き方は「形 数 色 向き」：例 'triangle 3 black'、'arrow 1 white 90'
//   形：circle square triangle diamond arrow / 数：1〜4 / 色：black gray white / 向き：0 90 180 270
// grid は左上から右へ、1〜8マス目（9マス目が「?」）。wrong はまちがいの選択肢3つ。
const FIGURE_DATA = {
  count: 6,
  categories: {
    count: { ja: '数', id: 'Jumlah' },
    color: { ja: '色', id: 'Warna' },
    dir:   { ja: '向き', id: 'Arah' },
    shape: { ja: '形', id: 'Bentuk' },
    combo: { ja: '組み合わせ', id: 'Kombinasi' }
  },
  questions: [
    { cat: 'count',
      grid: ['circle 1 black', 'circle 2 black', 'circle 3 black', 'square 1 black', 'square 2 black', 'square 3 black', 'triangle 1 black', 'triangle 2 black'],
      answer: 'triangle 3 black', wrong: ['triangle 2 black', 'square 3 black', 'triangle 3 white'],
      explain: { ja: '右へ行くほど数が1つずつ増える', id: 'Ke kanan, jumlahnya bertambah satu' } },
    { cat: 'color',
      grid: ['circle 1 white', 'circle 1 gray', 'circle 1 black', 'square 1 white', 'square 1 gray', 'square 1 black', 'diamond 1 white', 'diamond 1 gray'],
      answer: 'diamond 1 black', wrong: ['diamond 1 white', 'diamond 1 gray', 'square 1 black'],
      explain: { ja: '右へ行くほど色が濃くなる（白→灰→黒）', id: 'Ke kanan, warnanya makin gelap (putih → abu-abu → hitam)' } },
    { cat: 'dir',
      grid: ['arrow 1 black 0', 'arrow 1 black 90', 'arrow 1 black 180', 'arrow 1 black 90', 'arrow 1 black 180', 'arrow 1 black 270', 'arrow 1 black 180', 'arrow 1 black 270'],
      answer: 'arrow 1 black 0', wrong: ['arrow 1 black 90', 'arrow 1 black 180', 'arrow 1 black 270'],
      explain: { ja: '右へ1つ進むごとに、時計回りに90°回る', id: 'Setiap ke kanan, berputar 90° searah jarum jam' } },
    { cat: 'shape',
      grid: ['circle 1 white', 'square 1 white', 'triangle 1 white', 'square 1 gray', 'triangle 1 gray', 'circle 1 gray', 'triangle 1 black', 'circle 1 black'],
      answer: 'square 1 black', wrong: ['square 1 white', 'triangle 1 black', 'circle 1 black'],
      explain: { ja: 'どの横の列にも丸・四角・三角が1つずつある。色は横の列ごとに同じ', id: 'Setiap baris ada lingkaran, persegi, dan segitiga. Warna sama dalam satu baris' } },
    { cat: 'count',
      grid: ['diamond 3 gray', 'diamond 2 gray', 'diamond 1 gray', 'circle 3 gray', 'circle 2 gray', 'circle 1 gray', 'square 3 gray', 'square 2 gray'],
      answer: 'square 1 gray', wrong: ['square 2 gray', 'square 1 black', 'circle 1 gray'],
      explain: { ja: '右へ行くほど数が1つずつ減る', id: 'Ke kanan, jumlahnya berkurang satu' } },
    { cat: 'combo',
      grid: ['triangle 1 white', 'triangle 2 white', 'triangle 3 white', 'triangle 1 gray', 'triangle 2 gray', 'triangle 3 gray', 'triangle 1 black', 'triangle 2 black'],
      answer: 'triangle 3 black', wrong: ['triangle 3 gray', 'triangle 2 black', 'circle 3 black'],
      explain: { ja: '右へ行くと数が増え、下へ行くと色が濃くなる', id: 'Ke kanan jumlah bertambah, ke bawah warna makin gelap' } },
    { cat: 'count',
      grid: ['square 1 white', 'square 2 white', 'square 3 white', 'square 2 white', 'square 3 white', 'square 1 white', 'square 3 white', 'square 1 white'],
      answer: 'square 2 white', wrong: ['square 1 white', 'square 3 white', 'square 2 black'],
      explain: { ja: 'どの横の列にも1つ・2つ・3つが1回ずつある', id: 'Setiap baris ada 1, 2, dan 3 masing-masing sekali' } },
    { cat: 'combo',
      grid: ['arrow 1 white 0', 'arrow 1 white 90', 'arrow 1 white 180', 'arrow 1 gray 0', 'arrow 1 gray 90', 'arrow 1 gray 180', 'arrow 1 black 0', 'arrow 1 black 90'],
      answer: 'arrow 1 black 180', wrong: ['arrow 1 black 90', 'arrow 1 gray 180', 'arrow 1 black 0'],
      explain: { ja: '右へ行くと90°ずつ回り、下へ行くと色が濃くなる', id: 'Ke kanan berputar 90°, ke bawah warna makin gelap' } }
  ]
};
