# 河内寺廃寺跡 史跡解説Web 最小版

GitHub Pages向けの静的Webです。サーバーDBや外部AI APIは使用しません。

## 動作確認
`index.html` を file:// で直接開くとブラウザの制限でJSONを読めない場合があります。
GitHub Pagesに配置するか、ローカルHTTPサーバーで確認してください。

## 実装済み
- 報告書由来の史跡概要
- 地点別解説
- JSON検索による簡易対話
- 関連質問候補
- クイズ
- 出典ページ表示
- fact / interpretation / hypothesis / 未検出等の区別

## 未実装
- GPS地図（座標未確定）
- 報告書図版の画像転載
- 3D / AR / カメラ
- 全報告書のfacts抽出
- 自然言語検索の高度化

## データ
`data/` 内のJSONを編集すれば表示内容を追加できます。
