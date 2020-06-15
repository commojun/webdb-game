"use strict";
//1-1 クラスの定義
class Character {
  constructor(name, maxHp, maxMp, power, aa) {
    this.name = name;
    this.maxHp = maxHp;
    this.maxMp = maxMp;
    this.power = power;
    this.aa = aa;
  }
}
//1-2 変数、定数の宣言
const character = {
  player: 0, //プレイヤー
  slime: 1, // スライム
  //4-1 追加キャラクター
  max:2 //4-2 キャラクターの数
};
const phase = {
  encount: 0,
  command: 1,
  action: 2,
  max: 3
};
const command = {
  fight: 0,
  spell: 1,
  run: 2,
  max: 3
};
const commandNames = [
  'たたかう',
  'じゅもん',
  'にげる'
];
let characters = [
  new Character('ゆうしゃ', 15, 10, 3),
  new Character('スライム', 5, 0, 2,
                '　　人<br>'
                +'（＠ｖ＠）'),
  //5-1 追加キャラクター
];
let player;
let enemy;
let currentPhase;
let currentCharacter;
//1-3 関数の定義
function init() {
  //2-1 キャラクターの初期化
  player = characters[character.player];
  enemy = characters[character.slime]; //6-1 敵の設定
  player.target = enemy;
  enemy.target = player;
  player.hp = player.maxHp;
  enemy.hp = enemy.maxHp;
  player.mp = player.maxMp;
  enemy.mp = enemy.maxMp;
  player.command = command.fight;
  enemy.command = command.fight;
  player.damage = player.target.power;
  enemy.damage = enemy.target.power;
  //2-2 進行データの初期化
  currentPhase = phase.encount;
  currentCharacter = player;
  //2-3 キー入力イベントハンドラの登録
  window.onkeydown = onKeyDown;
  //2−4 描画処理
  draw();
}

function draw() {
  let html = '';
  //3-1 基本情報の描画
  html += `${player.name}<br>
ＨＰ：${player.hp}／${player.maxHp}<br>
ＭＰ：${player.mp}／${player.maxMp}<br>
こうげきりょく：${player.power}<br>
<br>`;
  html += `${enemy.aa}<br>
<br>
（ＨＰ：${enemy.hp}／${enemy.maxHp}）<br>`;
  //3-2 フェーズによる分岐
  html += '<br>';
  switch (currentPhase) {
  case phase.encount:
    //8-1 遭遇フェーズ
    html += `${enemy.name}が　あらわれた！<br>`;
    break;
  case phase.command:
    //8-2 コマンドフェーズ
    for (let i = 0; i < command.max; i++) {
      //11-1 カーソルの描画
      html += (i === currentCharacter.command) ? '＞' : '　';
      html += `${commandNames[i]}<br>`;
    }
    break;
  case phase.action:
    //8-3 行動フェーズ
    switch (currentCharacter.command) {
    case command.fight:
      //13-1 たたかう
      html += currentCharacter.name
        + 'の　こうげき！<br>'
        + currentCharacter.target.name
        + 'に　'
        + currentCharacter.target.damage
        + 'のダメージ！<br>';
      if (currentCharacter.target.hp <= 0) {
        html += currentCharacter.target.name
          + 'を　たおした！<br>';
      }
      break;
    case command.spell:
      //13-2 じゅもん
      break;
    case command.run:
      //13-3 にげる
      break;
    }
    break;
  }
  //3-3 操作方法の描画
  html += '<br>';
  if (currentPhase === phase.command) { //7-1 コマンドフェーズ判定
    //7-2 コマンドの操作方法表示
    html += `[w, s]:カーソル移動<br>
[その他キー]:コマンド決定`;
  }
  else {
    html += '何かキーを押してください';
  }
  //3-4 HTMLコードの出力
  let div = document.querySelector('div');
  div.innerHTML = html;
}

function onKeyDown(e) {
  //9-1 戦闘を終了する処理
  if ( (player.hp <= 0) || (enemy.hp <= 0) ) {
    init();
    return;
  }
  //9-2 フェーズによる分岐
  switch (currentPhase) {
  case phase.encount:
    //10-1 遭遇フェーズ
    currentPhase = phase.command;
    break;
  case phase.command:
    //10-2 コマンドフェーズ
    switch (e.key) {
    case 'w':
      currentCharacter.command--;
      break;
    case 's':
      currentCharacter.command++;
      break;
    default:
      //12-1 ターンの初期化
      currentPhase = phase.action;
      //12-2 最初の行動
      action();
      break;
    }
    if (currentCharacter.command < 0) currentCharacter.command += command.max;
    if (currentCharacter.command >= command.max) currentCharacter.command -= command.max;
    break;
  case phase.action:
    //10-3 行動フェーズ
    if (currentCharacter === player) currentCharacter = enemy;
    else if (currentCharacter === enemy) currentCharacter = undefined;
    if (currentCharacter !== undefined) action();
    else {
      //16-1 両者のターンが終わったら
      currentCharacter = player;
      currentPhase = phase.command;
    }
    break;
  }
  draw();
}

function action() {
  switch (currentCharacter.command) {
  case command.fight:
    //14-1 たたかう
    //15-1 ダメージ計算
    currentCharacter.target.damage = 1 + parseInt(Math.random() * currentCharacter.power);
    currentCharacter.target.hp -= currentCharacter.target.damage;
    //15-2 ダメージ制限
    if (currentCharacter.target.hp < 0) currentCharacter.target.hp = 0;
    break;
  case command.spell:
    //14-2 じゅもん
    break;
  case command.run:
    //14-3 にげる
    break;
  }
}
//1-4 関数の呼び出し
init();
