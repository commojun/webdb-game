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
const direction = {
  horizontal: 0,
  vertical: 1,
  max: 2
};
const directions = [
  new Vec2(1, 0), //horizontal
  new Vec2(0, 1) //vertical
];

let field;
let cursor;
let combo;
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
  combo = 0;
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
  if (combo === 0) { //4-1 コンボ中でなければ
    html += `[w, s, a, d]: カーソルを移動<br>
[その他キー]: ブロックを`;
    //4-2 掴む／離すを描画
    html += (cursor.isHolding) ? '離す' : '掴む';
  }
  else {
    //4-3 コンボ数の描画
    html += `${combo} コンボ！！`;
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
    startAnimation();
    break;
  }
  draw();
}

function removeBlocks() {
  let removed = false;
  //12-1 削除フラグテーブルの生成
  let toRemove = [];
  for (let i = 0; i < field.length; i++) {
    toRemove[i] = [];
    for (let j = 0; j < field[i].length; j++) {
      toRemove[i][j] = false;
    }
  }
  //12-2 削除判定
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      //13-1 ブロックの有無判定
      if(field[i][j] === block.none) continue;
      //13-2 縦横が揃っているか判定
      for (let k = 0; k < directions.length; k++) {
        let v = new Vec2(j, i);
        let chain = 1;
        //14-1 連結数のカウント
        while (true) {
          //15-1 連結数のカウント
          v = new Vec2(
            v.x + directions[k].x,
            v.y + directions[k].y
          );
          if ((v.x >= field[i].length) || (v.y >= field.length)) break;
          if (field[v.y][v.x] === field[i][j]) chain++;
          else break;
        }
        //14-2 揃ったら削除チェック
        if (chain >= 3) {
          removed = true;
          //16-1 消すブロックにチェック
          v = new Vec2(j, i);
          for (let l = 0; l < chain; l++) {
            toRemove[v.y][v.x] = true;
            v = new Vec2(
              v.x + directions[k].x,
              v.y + directions[k].y
            );
          }
        }
      }
    }
  }

  //12-3 削除実行
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (toRemove[i][j]) field[i][j] = block.none;
    }
  }
  //12-4 コンボ数のカウント
  if (removed) combo++;
  //12-5 再描画
  if (removed) draw();
  return removed;
}

function dropBlocks() {
  let dropped = false;
  //17-1 ブロックを落下させる
  for (let i = field.length - 1; i > 0; i--) {
    for (let j = 0; j < field[i].length; j++) {
      //18-1 各ブロックを落下させる
      if((field[i][j] === block.none) && (field[i-1][j] !== block.none)) {
        dropped = true;
        field[i][j] = field[i - 1][j];
        field[i - 1][j] = block.none;
      }
    }
  }
  //17-2 最上段にブロックを落下させる
  for (let i = 0; i< field[0].length; i++) {
    if (field[0][i] === block.none) {
      dropped = true;
      field[0][i] = 1 + parseInt(Math.random() * (block.max - 1));
    }
  }
  //17-3 再描画
  if (dropped) draw();
  return dropped;
}

function startAnimation() {
  window.onkeydown = null;
  window.onkeyup = null;
  //19-1 コンボ数の初期化
  combo = 0;
  updateAnimation();
}

function updateAnimation() {
  let dropped = true;
  //20-1 ブロックの落下
  dropped = dropBlocks();
  if (!dropped) {
    let removed = true;
    //20-2 ブロックの削除
    removed = removeBlocks();
    if (!removed) {
      //20-3 コンボ数のリセット
      combo = 0;
      draw();
      //20-4 コンボの終了
      endAnimation();
      return;
    }
  }
  //20-5 一定時間後に再び更新する
  setTimeout(updateAnimation, 300);
}

function endAnimation() {
  window.onkeydown = onKeyDown;
  window.onkeyup = onKeyUp;

}
//1-4 関数の呼び出し
init();
