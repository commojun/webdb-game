"use strict";
//1-1 クラスの定義
class BlockAA{
  constructor(release, hold) {
    this.release = release;
    this.hold = hold;
  }
}

class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
//1-2 変数／関数の宣言
const block = {
  none: 0,
  circle: 1, // ○
  triangle: 2, // △
  square: 3, // ◻︎
  diamond: 4, // ◇
  star: 5, // ☆
  max: 6
};
const blockAA = [
  new BlockAA('　', '　'),
  new BlockAA('○', '●'),
  new BlockAA('△', '▲'),
  new BlockAA('□', '■'),
  new BlockAA('◇', '◆'),
  new BlockAA('☆', '★'),
];
const fieldSize = new Vec2(6, 5);

let field;
//1-3 関数の定義
function init() {
  //2-1 フィールドの生成
  field = [];
  for (let i = 0; i < fieldSize.y; i++) {
    field[i] = [];
    for (let j = 0; j < fieldSize.x; j++) {
      //5-1 ブロックの生成
      let newBlock = parseInt(Math.random() * block.max);
      field[i].push(newBlock);
    }
  }
  //2-2 その他の初期化
  //2-3 イベントハンドラの登録
  //2-4 描画処理
  draw();
}

function draw() {
  let html = '';
  //3-1 フィールドの描画
  for (let i = 0;  i < field.length; i++) {
    for (let j = 0; j < field[i].length;  j++) {
      let aa = blockAA[field[i][j]].release;
      //6-1 掴んでいれば塗りつぶし
      html += aa;
    }
    //6-2 カーソルの行に矢印を描画
    html += '<br>';
  }
  //6-3 カーソルの列に矢印を描画
  //3-2 操作方法の描画
  html += '<br>';
  if (true) { //4-1 コンボ中でなければ
    html += `[w, s, a, d]: カーソルを移動<br>
[その他キー]: ブロックを`;
    //4-2 掴む／離すを描画
  }
  else {
    //4-3 コンボ数の描画
  }
  let  div = document.querySelector('div');
  div.innerHTML = html;
}
//1-4 関数の呼び出し
init();
