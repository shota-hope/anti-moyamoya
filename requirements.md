# Requirements Document

## Introduction

MoyaMoyaは、1日5分で頭の中の思考を言語化するスキルを鍛えるトレーニングアプリである。「ためる」「問う」「まとめる」の3ステップを通じて、漠然とした感情や思考を明確な言葉に変換する習慣を身につけることを目的とする。メモ（ためる）はいつでも独立して行え、ためたメモから「問う」セッションを開始できる。

## Glossary

- **MoyaMoya**: 本アプリケーションの名称。思考言語化トレーニングシステム
- **メモ**: ユーザーが記録する心が動いた出来事の記録。セッションとは独立して作成・保存される
- **ためる**: 心が動いた出来事を具体的にメモするフェーズ。いつでも実行可能
- **問うステップ**: メモに「のはなぜか？」を付けて自問し、3分間で5つ以上の理由を書き出すフェーズ
- **まとめるステップ**: キーワードを抽出し、結論を1行にまとめ、次の行動を意識するフェーズ
- **セッション**: メモを起点とした「問う→まとめる」の一連の深掘りトレーニング

## Requirements

### Requirement 1

**User Story:** As a ユーザー, I want to 心が動いた出来事をいつでもメモとして記録したい, so that 気づいた瞬間を逃さず記録できる

#### Acceptance Criteria

1. WHEN ユーザーがメモ作成画面を開く THEN MoyaMoyaは出来事入力フィールドを表示する
2. WHEN ユーザーが出来事を入力して保存ボタンを押す THEN MoyaMoyaはメモをローカルストレージに永続化する
3. WHEN ユーザーが空の出来事で保存を試みる THEN MoyaMoyaは保存を拒否し、入力を促すメッセージを表示する
4. WHEN メモが保存される THEN MoyaMoyaは作成日時をメモに自動付与する
5. WHEN メモが保存される THEN MoyaMoyaはメモ一覧画面に遷移する

### Requirement 2

**User Story:** As a ユーザー, I want to ためたメモの一覧を確認したい, so that どのメモを深掘りするか選べる

#### Acceptance Criteria

1. WHEN ユーザーがメモ一覧画面を開く THEN MoyaMoyaは保存されたメモを日付の新しい順に一覧表示する
2. WHEN メモ一覧が表示される THEN MoyaMoyaは各メモに出来事の要約と作成日時を表示する
3. WHEN メモ一覧が空の場合 THEN MoyaMoyaは「まだメモがありません」というメッセージを表示する
4. WHEN ユーザーがメモ一覧から特定のメモを選択する THEN MoyaMoyaはそのメモの詳細と「深掘りを始める」ボタンを表示する

### Requirement 3

**User Story:** As a ユーザー, I want to メモに対して「なぜ？」を問いかけて理由を書き出したい, so that 感情の根本原因を深掘りできる

#### Acceptance Criteria

1. WHEN ユーザーがメモ詳細画面で「深掘りを始める」ボタンを押す THEN MoyaMoyaは問うステップを開始し、メモの出来事に「はなぜか？」を付加して表示し、「5つ以上を目標にしましょう」というガイダンスを表示する
2. WHEN 問うステップが開始される THEN MoyaMoyaは3分間のカウントダウンタイマーを開始する
3. WHILE タイマーが動作中 THEN MoyaMoyaは残り時間を秒単位で表示する
4. WHEN ユーザーが理由を入力する THEN MoyaMoyaは入力された理由の数をリアルタイムでカウント表示する
5. WHEN タイマーが0になる THEN MoyaMoyaは入力を自動保存し、まとめるステップへの遷移ボタンを表示する

### Requirement 4

**User Story:** As a ユーザー, I want to 書き出した内容から結論を1行にまとめたい, so that 思考を明確な言葉として定着させられる

#### Acceptance Criteria

1. WHEN ユーザーがまとめるステップを開始する THEN MoyaMoyaは問うステップで書いた理由一覧を表示する
2. WHEN まとめるステップが表示される THEN MoyaMoyaはキーワード入力フィールドと結論入力フィールドと次の行動入力フィールドを表示する
3. WHEN ユーザーが結論を入力して完了ボタンを押す THEN MoyaMoyaはセッション全体をローカルストレージに保存する
4. WHEN セッションが完了する THEN MoyaMoyaは完了メッセージと共にセッションのサマリーを表示する

### Requirement 5

**User Story:** As a ユーザー, I want to 過去のセッション履歴を確認したい, so that 自分の思考パターンを振り返ることができる

#### Acceptance Criteria

1. WHEN ユーザーがセッション履歴画面を開く THEN MoyaMoyaは完了したセッションを日付の新しい順に一覧表示する
2. WHEN ユーザーがセッション一覧から特定のセッションを選択する THEN MoyaMoyaはそのセッションの全ステップの内容を詳細表示する
3. WHEN セッション一覧が空の場合 THEN MoyaMoyaは「まだセッションがありません」というメッセージを表示する

### Requirement 6

**User Story:** As a ユーザー, I want to シンプルで落ち着いたUIでトレーニングしたい, so that 集中して思考の言語化に取り組める

#### Acceptance Criteria

1. WHEN アプリが起動する THEN MoyaMoyaはホーム画面に「メモを書く」ボタンと「メモ一覧」ボタンと「セッション履歴」ボタンを表示する
2. WHEN ユーザーがセッション中にいる THEN MoyaMoyaは現在のステップ（問う/まとめる）を明確に表示する
3. WHEN ユーザーが各ステップを完了する THEN MoyaMoyaは次のステップへスムーズに遷移する


