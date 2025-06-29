from .settings import *

# テスト用のデータベース設定。GitHub ActionsではメモリSQLiteを使用
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
