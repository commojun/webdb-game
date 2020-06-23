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

class Cursor{
  constructor(pos) {
    this.pos = pos;
    //7-1 ブロックを掴んでいるフラグ
    this.isHolding = false;
  }
}
//1-2 変数／関数の宣言
const block = {
  none: 0,
  circle: 1, // ○
  triangle: 2, // △
  square: 3, // □
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
let cursor;
//1-3 関数の定義
function init() {
  //2-1 フィールドの生成
  field = [];
  for (let i = 0; i < fieldSize.y; i++) {
    field[i] = [];
    for (let j = 0; j < fieldSize.x; j++) {
      //5-1 ブロックの生成
      let newBlock = 1 + parseInt(Math.random() * (block.max - 1));
      field[i].push(newBlock);
    }
  }
  //2-2 その他の初期化
  cursor = new Cursor(new Vec2(0, 0));
  //2-3 イベントハンドラの登録
  window.onkeydown = onKeyDown;
  window.onkeyup = onKeyUp;
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
      if (cursor.isHolding
          && (i === cursor.pos.y)
          && (j === cursor.pos.x))
        aa = blockAA[field[i][j]].hold;
      html += aa;
    }
    //6-2 カーソルの行に矢印を描画
    if (i === cursor.pos.y) html += '←';
    html += '<br>';
  }
  //6-3 カーソルの列に矢印を描画
  for (let i = 0; i < field[0].length; i++) {
    if (i === cursor.pos.x) html += '↑';
    else html += '　';
  }
  html += '<br>';
  //3-2 操作方法の描画
  html += '<br>';
  if (true) { //4-1 コンボ中でなければ
    html += `[w, s, a, d]: カーソルを移動<br>
[その他キー]: ブロックを`;
    //4-2 掴む／離すを描画
    html += (cursor.isHolding) ? '離す' : '掴む';
  }
  else {
    //4-3 コンボ数の描画
  }
  let  div = document.querySelector('div');
  div.innerHTML = html;
}

function onKeyDown(e) {
  //8-1 カーソルの移動前の座標を保存
  let lastPos = new Vec2(cursor.pos.x, cursor.pos.y);
  //8-2 カーソルの操作
  switch (e.key) {
  case 'w': cursor.pos.y--; break;
  case 's': cursor.pos.y++; break;
  case 'a': cursor.pos.x--; break;
  case 'd': cursor.pos.x++; break;
  default:
    //10-1 ブロックを掴む
    cursor.isHolding = true;
    break;
  }
  //8-3 カーソルの移動制限
  if (cursor.pos.x < 0) cursor.pos.x += fieldSize.x;
  if (cursor.pos.x >= fieldSize.x) cursor.pos.x -= fieldSize.x;
  if (cursor.pos.y < 0) cursor.pos.y += fieldSize.y;
  if (cursor.pos.y >= fieldSize.y) cursor.pos.y -= fieldSize.y;
  //8-4 ブロックの入れ替え
  if (cursor.isHolding) {
    let temp = field[lastPos.y][lastPos.x];
    field[lastPos.y][lastPos.x] = field[cursor.pos.y][cursor.pos.x];
    field[cursor.pos.y][cursor.pos.x] = temp;
  }
  draw();
}

function onKeyUp(e) {
  //9-1 掴んでいたブロックを離す
  switch (e.key) {
  case 'w':
  case 's':
  case 'a':
  case 'd':
    break;
  default:
    cursor.isHolding = false;
    //11-1 コンボを開始する
    break;
  }
  draw();
}
//1-4 関数の呼び出し
init();
