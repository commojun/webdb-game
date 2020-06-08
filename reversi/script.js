"use strict";

//1-1 クラスの定義

//1-2 変数、定数の宣言
let message;

//1-3 関数の定義

//リスト2 初期化関数
function init() {
  //2-1 盤面の生成
  //2-2 ゲームの初期化
  message = '';
  //2-3 描画処理
  draw();
}

//リスト3 描画関数
function draw() {
  //3-1 描画の前処理
  let html = '';
  //3-2 盤面の描画
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
