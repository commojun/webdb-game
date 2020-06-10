"use strict";

//1-1 クラスの定義
class Vec2 {
  constructor(x, y) {
    this.x = x;
    this.y = y
  }
}
//1-2 変数、定数の宣言
let message;
let board;
let cursorPos;
let turn;

const boardSize = new Vec2(8, 8);
const diskColor = {
  dark: 0,  // 黒
  light: 1, // 白
  none: 2,  // なし
  max: 3,　 // 要素数
};
const diskAA = [
  '◉', // dark
  '◯', // light
  '・', // none
];
const diskNames = [
  '黒',
  '白',
];

//1-3 関数の定義
function onKeyDown(e) {
  //7-1 操作前
  message = '';
  if (isGameEnd()) {
    init();
    return;
  }
  //7-2 カーソル操作、石を置く
  switch (e.key) {
  case 'w': cursorPos.y--; break;
  case 's': cursorPos.y++; break;
  case 'a': cursorPos.x--; break;
  case 'd': cursorPos.x++; break;
  default:
    onOtherKeyDown(); //8-1 石を置く処理
  }
  //7-3 カーソルの移動範囲の制限
  if (cursorPos.x < 0) cursorPos.x += boardSize.x;
  if (cursorPos.x >= boardSize.x) cursorPos.x -= boardSize.x;
  if (cursorPos.y < 0) cursorPos.y += boardSize.y;
  if (cursorPos.y >= boardSize.y) cursorPos.y -= boardSize.y;
  //7-4 再描画
  draw();
}

function onOtherKeyDown() {
  if (checkCanPlace(turn, cursorPos, false)) { //9-1 石を置けるか判定
    //9-2 石をひっくり返す
    checkCanPlace(turn, cursorPos, true);
    //9-3 石を置く
    board[cursorPos.y][cursorPos.x] = turn;
    //9-4 ゲームの終了判定
    if (isGameEnd()) {
      //16-1 ゲームの終了処理
      let count = [0, 0];
      for (let i = 0; i < boardSize.y; i++) {
        for (let j = 0; j < boardSize.x; j++) {
          if (board[i][j] !== diskColor.none) count[board[i][j]]++;
        }
      }
      message += diskNames[diskColor.dark] + ':'
        + count[diskColor.dark]
        + '-'
        + diskNames[diskColor.light] + ':'
        + count[diskColor.light]
        + '<br>';
      let winner = diskColor.none;
      if (count[diskColor.dark] > count[diskColor.light]) winner = diskColor.dark;
      else if (count[diskColor.light] > count[diskColor.dark]) winner = diskColor.light;
      if (winner !== diskColor.none) message += `${diskNames[winner]}の勝利です！<br>`;
      else message += '引き分けです。<br>';
      message += '<br>';
      return;
    }
    //9-5 ターンを切り替える
    takeTurn();
    //9-6 相手がパスの場合
    if (!checkCanPlaceAll(turn)) {
      message = diskNames[turn] + 'はパスしました。<br>';
      takeTurn();
    }
  }
  else
    message += 'そこには置けません。<br>'; //9-7 石が置けないメッセージ
}

function takeTurn() {
  if (turn === diskColor.dark)
    turn = diskColor.light;
  else
    turn = diskColor.dark;
}

function checkCanPlace(color, pos, reverse) {
  let result = false; // 置けるかどうかの結果
  //10-1 判定
  if (board[pos.y][pos.x] !== diskColor.none) {
    return false;
  }
  for (let i = -1; i <= 1; i++){
    for (let j = -1; j <= 1; j++){
      let dir = new Vec2(j, i);
      if ((dir.x === 0) && (dir.y === 0)) continue;
      //11-1 隣の座標を求める
      let checkPos = new Vec2(pos.x + dir.x, pos.y + dir.y);
      //11-2 判定
      if (!isInBoard(checkPos)) continue;
      let opponent;
      if (color === diskColor.dark) opponent = diskColor.light;
      else opponent = diskColor.dark;
      if (board[checkPos.y][checkPos.x] !== opponent) continue;
      while (true) {
        //12-1 各マスの判定
        checkPos.x += dir.x;
        checkPos.y += dir.y;
        if (!isInBoard(checkPos)) break;
        if (board[checkPos.y][checkPos.x] === diskColor.none) break;
        if (board[checkPos.y][checkPos.x] === color) {
          result = true;
          //13-1 ひっくり返し可能
          if (reverse) {
            //14-1 ひっくり返す処理
            let reversePos = new Vec2(pos.x, pos.y);
            while(true) {
              //15-1 挟んだ相手の石をひっくり返す
              reversePos.x += dir.x;
              reversePos.y += dir.y;
              if ((reversePos.x === checkPos.x)
                  && (reversePos.y === checkPos.y)) break;
              board[reversePos.y][reversePos.x] = color;
            }
          }
          break;
        }
      }
    }
  }
  return result;
}

function isInBoard(v) {
  return v.x >= 0
    && v.x < boardSize.x
    && v.y >= 0
    && v.y < boardSize.y;
}

function checkCanPlaceAll(color) {
  for (let i = 0; i < boardSize.y; i++) {
    for (let j = 0; j < boardSize.x; j++) {
      if (checkCanPlace(color, new Vec2(j, i), false)) return true;
    }
  }
  return false;
}

function isGameEnd() {
  return (!checkCanPlaceAll(diskColor.dark)) && (!checkCanPlaceAll(diskColor.light));
}

//リスト2 初期化関数
function init() {
  //2-1 盤面の生成
  board = [];
  for (let i = 0; i < boardSize.y; i++) {
    board[i] = [];
    // 5-1 各行の列の生成
    for (let j = 0; j < boardSize.x; j++) {
      board[i][j] = diskColor.none;
    }
  }
  //2-2 ゲームの初期化
  message = '';
  board[3][4] = diskColor.dark;
  board[4][3] = diskColor.dark;
  board[3][3] = diskColor.light;
  board[4][4] = diskColor.light;
  cursorPos = new Vec2(0, 0);

  turn = diskColor.dark;
  //2-3 描画処理
  window.onkeydown = onKeyDown;
  draw();
}

//リスト3 描画関数
function draw() {
  //3-1 描画の前処理
  let html = '';
  //3-2 盤面の描画
  for (let i = 0; i < boardSize.y; i++) {
    for (let j = 0; j < boardSize.x; j++) {
      //6-1 マスの描画
      html += diskAA[board[i][j]];
    }
    //6-2 カーソルの行に矢印を描画
    if (i === cursorPos.y) html += '←';
    //6-3 改行
    html += '<br>';
  }
  //6-4 カーソルの列に矢印を描画
  for (let i = 0; i < boardSize.x; i++) {
    html += (i === cursorPos.x) ? '↑' : '　';
  }
  html += '<br>';
  //3-3 メッセージ処理
  if(!isGameEnd()) { //4-1 ゲームの終了判定
    //4-2 ターンのメッセージ処理
    message += `${diskNames[turn]}のターンです。<br>`;
    message += `<br>
[w, s, a, d]:カーソル移動<br>
[その他キー]:石を置く`;
  }
  else {
    //4-3 ゲーム終了時の処理
    message += '何かキーを押してください。';
  }
  //3-4 HTMLファイルへ出力
  html += '<br>' + message;
  let div = document.querySelector('div');
  div.innerHTML = html;
}
//1-4 関数の呼び出し
init();
