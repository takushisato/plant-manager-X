# 工場管理くん ProtoType

###  「工場管理くん」 は、Django（バックエンド）、React（フロントエンド）、MySQL（データベース）を使用した 工場の生産管理アプリ です。

ProtoTypeで開発している機能

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

### プロジェクト構成図

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

### 環境構築

#### 必要なツール

- Docker
- Docker Compose
- Node.js
- Poetry

####  よく使うコマンド

```
# dockerビルド
docker compose build --no-cache

# docker起動
docker compose up -d

# docker停止
docker-compose down

# dockerのdjangoに接続
docker-compose exec web poetry run python manage.py shell

# dockerのMySQLに接続
docker-compose exec db mysql -u root -p

# ローカル環境起動コマンド
python manage.py runserver

# ローカルのshell
python manage.py shell

# マイグレーション作成
python manage.py makemigrations

# DBに反映
python manage.py migrate

```

#### アクセス方法

| 機能        | URL                          |
|-------------|------------------------------|
| フロントエンド (React) | [http://localhost:5173/](http://localhost:5173/) |
| バックエンド (Django API) | [http://localhost:8000/](http://localhost:8000/) |
| Django 管理画面 | [http://localhost:8000/admin/](http://localhost:8000/admin/) |
| MySQL (データベース) | `localhost:3306` |

