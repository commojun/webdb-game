"use strict";
//1-1 クラスの定義
class Vec2{
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
class Character {
  constructor(aa) {
    this.aa = aa;
  }
}
//1-2 変数・定数の宣言
const cell = {
  none: 0, //床
  wall: 1, //壁
  dot: 2, //ドット
  max: 3
};
const cellAA = [
  '　',
  '口',
  '・'
];
const character = {
  player: 0,
  enemy0: 1,
  enemy1: 2,
  max: 3
};
let maze = [
  [1,1,1,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,1],
  [1,0,1,0,1,0,1,0,1],
  [1,0,1,0,1,0,1,0,1],
  [0,0,0,0,1,0,0,0,0],
  [1,0,1,0,0,0,1,0,1],
  [1,0,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,1]
];

let characters = [
  new Character('Ｐ'),
  new Character('Ｒ'),
  new Character('Ｃ')
];
let player = characters[character.player];
let enemies = [
  characters[character.enemy0],
  characters[character.enemy1]
];
let intervalID;
let ai = {
  random: 0,
  chase: 1,
  max: 2
};
let direction = {
  up: 0,
  left: 1,
  down: 2,
  right: 3,
  max: 4
};
let directions = [
  new Vec2(0, -1), //上
  new Vec2(-1, 0), //左
  new Vec2(0, 1), //下
  new Vec2(1, 0) //右
];
//1-3 関数の定義
function init() {
  //2-1 迷路の初期化
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === cell.none) maze[i][j] = cell.dot;
    }
  }
  //2-2 プレイヤーの初期化
  player.pos = new Vec2(4, 1);
  //2-3 敵の初期化
  enemies[0].pos = new Vec2(1, 4);
  enemies[0].ai = ai.random;
  enemies[1].pos = new Vec2(7, 4);
  enemies[1].ai = ai.chase;
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].lastPos = new Vec2(
      enemies[i].pos.x,
      enemies[i].pos.y
    );
  }
  //2-4 描画処理
  draw();
  //2-5 イベントハンドラの初期化
  if (typeof (intervalID) !== 'undefined') {
    clearInterval(intervalID);
  }
  //2-6 イベントハンドラの登録
  window.onkeydown = onKeyDown;
  intervalID = window.setInterval(interval, 1000);
}
function draw() {
  let html = '';
  //3-1 迷路の描画
  let str;
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      str = cellAA[maze[i][j]];
      //4-1 キャラクターの描画
      for (let k = 0; k < characters.length; k++) {
        if ((i === characters[k].pos.y) && (j === characters[k].pos.x)) {
          str = characters[k].aa;
        }
      }
      html += str;
    }
    html += '<br>';
  }
  //3-2 操作方法の描画
  html += `<br>
[w, s, a, d]:プレイヤーの移動`;
  //3-3 HTMLコードの出力
  let div = document.querySelector('div');
  div.innerHTML = html;
}

function onKeyDown(e) {
  //7-1 プレイヤーの操作
  let targetPos = new Vec2(player.pos.x, player.pos.y);
  switch(e.key) {
  case 'w': targetPos.y--; break;
  case 's': targetPos.y++; break;
  case 'a': targetPos.x--; break;
  case 'd': targetPos.x++; break;
  }
  //8-1 仮の座標を迷路内でループさせる
  loopPos(targetPos);
  switch (maze[targetPos.y][targetPos.x]) {
  case cell.none:
    player.pos = new Vec2(targetPos.x, targetPos.y);
    break;
  case cell.wall:
    break;
  case cell.dot:
    player.pos = new Vec2(targetPos.x, targetPos.y);
    //8-2 ドットを食べる処理
    maze[targetPos.y][targetPos.x] = cell.none;
    break;
  }
  //7-2 ゲームの終了判定
  if (isEnd()){
    init();
    return;
  }
  draw();
}

function loopPos(v) {
  if (v.x < 0) v.x += maze[0].length;
  if (v.x >= maze[0].length) v.x -= maze[0].length;
  if (v.y < 0) v.y += maze.length;
  if (v.y >= maze.length) v.y -= maze.length;
}

function interval() {
  //9-1 敵を動かす処理
  for (let i = 0; i < enemies.length; i++) {
    enemyMove(enemies[i]);
  }
  //9-2 ゲームの終了判定
  if (isEnd()){
    init();
    return;
  }
  //9-3 再描画
  draw();
}

function enemyMove(enemy) {
  //10-1 移動可能座標のリストアップ
  let canMoveList = [];
  let v;
  for (let i = 0; i < direction.max; i++) {
    v = new Vec2(
      enemy.pos.x + directions[i].x,
      enemy.pos.y + directions[i].y
    );
    loopPos(v);
    //11-1 移動可能か判定
    if (maze[v.y][v.x] === cell.wall) continue;
    if ((v.x === enemy.lastPos.x) && (v.y === enemy.lastPos.y)) continue;
    //11-2 移動可能リストに追加
    canMoveList.push(v);
  }
  //10-2 移動先の決定
  //12-1 移動前の処理
  enemy.lastPos = new Vec2(enemy.pos.x, enemy.pos.y);
  switch (enemy.ai) {
  case ai.random:
    //12-2 ランダムタイプ
    let r = parseInt(Math.random() * canMoveList.length);
    enemy.pos = canMoveList[r];
    break;
  case ai.chase:
    //12-3 追いかけタイプ
    function getDistance(v0, v1) {
      return Math.sqrt(Math.pow(v0.x - v1.x, 2) + Math.pow(v0.y - v1.y, 2));
    }
    let nearest = canMoveList[0];
    for (let i = 0; i < canMoveList.length; i++) {
      if (getDistance(player.pos, nearest) > getDistance(player.pos, canMoveList[i])) {
        nearest = canMoveList[i];
      }
    }
    enemy.pos = new Vec2(nearest.x, nearest.y);
    break;
  }
}

function isEnd() {
  //13-1 プレイヤーと敵の当り判定
  for (let i = 0; i < enemies.length; i++) {
    if ((enemies[i].pos.x === player.pos.x) && (enemies[i].pos.y === player.pos.y)) {
      return true;
    }
  }
  //13-2 残りドットの有無
  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === cell.dot) return false;
    }
  }
  return true;
}
//1-4 関数の呼び出し
init();
