# 工場管理くん ProtoType

#### 「工場管理くん」 は、 Django ＋ React ＋ MySQL を使用して開発している、製造業向け生産管理アプリです。

<br>

## ProtoType で開発している機能

```
- 資材管理
    - 保有している資材の在庫を一覧で確認、払い出しができる
- 勤怠管理
    - 従業員の出勤、有給、残業の一覧など確認する
- 生産計画
    - 日々の生産計画の立案と実績をガントチャートで管理する
- 受注管理
    - 現在の受注状況を社内で共有
- 不具合管理
    - 発生した不具合の内容と対策を共有
- メール送信
    - 従業員に向けて一斉送信
```

<br>

## ドキュメント

Notion でドキュメントを作成し、公開しています。

[Notion にアクセスする](https://cloud-cress-615.notion.site/1bb36de090e0802298cdc27922c53df4)

<br>

## プロジェクト構成図

```
project-root/
│── frontend/        # フロントエンド（React + Vite + TypeScript）
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── .docker/
│       ├── Dockerfile
│── backend/         # バックエンド（Django + MySQL）
│   ├── manage.py
│   ├── server/
│   ├── app/
│   ├── .docker/
│       ├── Dockerfile
│   ├── pyproject.toml  # Poetry で管理
│── docker-compose.yml
│── README.md
```

<br>

## 環境構築

### 必要なツール

- Docker
- Docker Compose
- Node.js
- Poetry

### 環境構築手順

#### docker 環境

```
# 初回起動時。マイグレーションは手動で行ってください。
## 1, dockerビルド
docker compose build --no-cache

## 2, docker起動
docker compose up -d

## 3, dockerのdjangoに接続
docker compose exec backend bash

## 4, マイグレーション
python manage.py migrate

## 5, sheederの流し込み（開発環境のみ）
bash scripts/sheeder.sh

### もしも5でエラーになる（$'\r': command not found）なら以下を実行し、再度5を実行
sed -i 's/\r//' scripts/sheeder.sh

## 6, dockerのbash終了（docker-compose exec web bash でdockerに入ってる状態）
exit

# dockerのfrontendに接続する場合
docker compose exec frontend sh

# docker停止
docker compose down

```

#### ローカル環境

backend の構築

```
# 1, backendに移動
cd backend

# 2, poetryのインストール
pip install poetry

# 3, poetryのshellに入る
poetry shell

# 4, ここでpoetryのshellに入れない場合は以下を実行してください
poetry self add poetry-plugin-shell

# 5, poetryから環境構築（Windowsの場合、mysqlclientのドライバでエラーになることがあります。その場合は最下部の「Windowsの場合」のコマンドを実行してください。）
poetry install

# 6, マイグレーション
python manage.py migrate

# 7, sheederの流し込み（開発環境のみ）
bash scripts/sheeder.sh

# 8, ローカル環境起動コマンド
python manage.py runserver

# 9, ローカル環境停止
control + c

```

frontend の構築

```
# 1, frontendに移動
cd frontend

# 2, 環境のインストール
npm install

# 3, 起動
npm run dev

# 4, ローカル環境停止
control + c

# 5, ビルド
npm run build

```

### よく使うコマンド

テーブル修正時

```
# マイグレーションファイル作成
python manage.py makemigrations

# DBに反映
python manage.py migrate

# pytestの実行
pytest

```

### アクセス方法

| 機能                      | URL                   |
| ------------------------- | --------------------- |
| フロントエンド (React)    | localhost:5173/       |
| バックエンド (Django API) | localhost:8000/       |
| Django 管理画面           | localhost:8000/admin/ |
| MySQL (データベース)      | localhost:3306        |

### Windowsの場合

win機（WSL）の場合、mysqlclient 環境作成時にドライバが必要な時があります。

```
# mysqlclient のビルドに必要なシステム依存パッケージ

sudo apt update  
sudo apt install -y pkg-config default-libmysqlclient-dev build-essential
```

### CI及び自動について

現時点でpytestを実装済み。
CIではモックのSQlite3を使用して、自動テストを行っている。

ローカルでpytestを行う場合は、docker環境に入る必要がある。

```
# docker環境のバックエンドに入る
docker compose exec backend bash

# pytestの実行
pytest

```