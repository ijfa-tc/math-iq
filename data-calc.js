// 計算の問題設定（問題は毎回この設定から自動で作られます）
// [最小, 最大] は数の範囲です。
const CALC_DATA = {

  // 四則計算：ops を順番に使って count 問作る
  arithmetic: {
    count: 10,
    ops: [
      { op: '+', a: [10, 99], b: [10, 99] },
      { op: '-', a: [20, 99], b: [10, 99] },     // 答えがマイナスにならないよう自動で入れ替え
      { op: '×', a: [10, 99], b: [2, 12] },
      { op: '÷', answer: [2, 20], b: [2, 12] }   // 割り切れる問題だけ作る
    ]
  },

  // 単位換算：exp は「一番小さい単位の何桁上か」（mm=0, cm=1, dm=2, m=3）
  units: {
    count: 10,
    maxDecimals: 2,      // 答えの小数点以下の最大桁数
    maxAnswer: 100000,   // 答えの最大
    groups: [
      { name: { ja: '長さ', id: 'Panjang' }, units: [
        { u: 'm', exp: 3 }, { u: 'dm', exp: 2 }, { u: 'cm', exp: 1 }, { u: 'mm', exp: 0 }
      ] }
      // 重さを足すときの例：
      // { name: { ja: '重さ', id: 'Berat' }, units: [ { u: 'kg', exp: 3 }, { u: 'g', exp: 0 } ] }
    ]
  },

  // 連続たし算（クレペリン型）
  kraepelin: {
    seconds: 60,
    digitMin: 3,   // 出る数字の範囲
    digitMax: 9
  }
};
