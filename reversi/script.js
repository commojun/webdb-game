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


//1-3 関数の定義
function onKeyDown(e) {
  //7-1 操作前
  message = '';
  //7-2 カーソル操作、石を置く
  switch (e.key) {
  case 'w': cursorPos.y--; break;
  case 's': cursorPos.y++; break;
  case 'a': cursorPos.x--; break;
  case 'd': cursorPos.x++; break;
  default:
    //8-1 石を置く処理
  }
  //7-3 カーソルの移動範囲の制限
  if (cursorPos.x < 0) cursorPos.x += boardSize.x;
  if (cursorPos.x >= boardSize.x) cursorPos.x -= boardSize.x;
  if (cursorPos.y < 0) cursorPos.y += boardSize.y;
  if (cursorPos.y >= boardSize.y) cursorPos.y -= boardSize.y;
  //7-4 再描画
  draw();
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
  if(true) { //4-1 ゲームの終了判定
    //4-2 ターンのメッセージ処理
    message += `<br>
[w, s, a, d]:カーソル移動<br>
[その他キー]:石を置く`;
  }
  else
    ;//4-3 ゲーム終了時の処理

  //3-4 HTMLファイルへ出力
  html += '<br>' + message;
  let div = document.querySelector('div');
  div.innerHTML = html;
}
//1-4 関数の呼び出し
init();
