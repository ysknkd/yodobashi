
## Description

選択した文字列をヨドバシで検索するための Chrome Extension です。

## Development

* ページ読み込みの際に `result.js` と `background.js` がロードされ、 `result.js` は `background.js` からのメッセージを待機します
* 選択した文字列を検索する際に、クロスオリジンの制約を回避するために `background.js` で通信し結果を `result.js` に送信します
* ヨドバシは API がないっぽいのでスクレイピングしています

## ToDo

* [x] 右クリック拡張
* [x] 選択文字列の取得
* [x] 選択文字列を検索（検索結果はコンソールログに出力）
* [x] タブで検索結果を開く
* [x] 画面内に検索結果を表示する
* [x] iframe がすでに存在する場合は再利用する
* [x] ユーザが iframe をとじることができる
* [x] リクエスト時にローディング画面を表示する
* [x] ポイントを表示する
* [x] 結果が存在しなかった場合にその旨を表示する
* [x] ユーザがオプションで、タブで開くと iframe で開くを選択できるようにする
* [x] パッケージ化してみる
  * パッケージ化した拡張機能をインストールするにはアップロードするしかなさそう
  * https://stackoverflow.com/questions/56930454/chrome-extension-throws-crx-file-error-crx-requird-proof-missing
* [ ] バッケージ化に必要なデータを作る（スクリーンショットとか）
* [ ] アイコンを作る
* [ ] 表示結果のデザインを見直す

