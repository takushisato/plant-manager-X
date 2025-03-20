# Vite + TypeScript + React 用の Node イメージ
FROM node:18-alpine

# 作業ディレクトリを `/app` に設定
WORKDIR /app

# 依存関係のキャッシュを利用するため package.json と package-lock.json をコピー
COPY ../package.json ../package-lock.json* ./ 

# 必要なパッケージをインストール
RUN npm install

# プロジェクトファイルをコピー
COPY ../ ./

# Vite の開発サーバーのポートを開放
EXPOSE 5173

# 開発用サーバーを起動
CMD ["npm", "run", "dev"]
