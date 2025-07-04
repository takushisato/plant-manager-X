"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 4.2.3.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
import os
import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
env.read_env(os.path.join(BASE_DIR, ".env"))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-d#23&ag4xtwxdstxluxw0cv&(w(dktv69_6jv*@zf6w)wfp#w="

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

CREATE_APPS = [
    "apps.attendance",
    "apps.staff_hub",
    "apps.bug_note",
    "apps.mail",
    "apps.master_data",
    "apps.material",
    "apps.prod_flow",
    "apps.trade_flow",
    "apps.utility",
]

DEFAULT_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_APPS = [
    "rest_framework",
    "rest_framework.authtoken",
    "corsheaders",
    "djoser",
    "drf_spectacular",
]

INSTALLED_APPS = DEFAULT_APPS + CREATE_APPS + THIRD_APPS

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "server.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "server.wsgi.application"


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

# データベース設定。SQLiteとMySQLを選択可能。使用しない方をコメントアウト
DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("DB_NAME") or "mydatabase",
        "USER": os.environ.get("DB_USER") or "user",
        "PASSWORD": os.environ.get("DB_PASSWORD") or "password",
        "HOST": os.environ.get("DB_HOST") or "mysql",
        "PORT": os.environ.get("DB_PORT") or 3306,
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = "ja"

TIME_ZONE = "Asia/Tokyo"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
    ],
}

DJOSER = {
    # メールアドレスでログイン
    "LOGIN_FIELD": "email",
    # アクティベートメールの送信
    "SEND_ACTIVATION_EMAIL": True,
    # アクティベート完了メールの送信
    "SEND_CONFIRMATION_EMAIL": True,
    # メールアドレス変更完了メールの送信
    "USERNAME_CHANGED_EMAIL_CONFIRMATION": True,
    # パスワード変更完了メールの送信
    "PASSWORD_CHANGED_EMAIL_CONFIRMATION": True,
    # アカウント登録時に確認用パスワードを一緒に送信
    "USER_CREATE_PASSWORD_RETYPE": True,
    # メールアドレス変更時に確認用パスワードを一緒に送信
    "SET_USERNAME_RETYPE": True,
    # パスワード変更時に確認用パスワードを一緒に送信
    "SET_PASSWORD_RETYPE": True,
    # アクティベートURL
    "ACTIVATION_URL": "auth/activation/?uid={uid}&token={token}",
    # メールアドレスリセット完了用URL（モデルを変更しているためユーザーネームではない）
    "USERNAME_RESET_CONFIRM_URL": "settings/auth/confirm-email/?uid={uid}&token={token}",
    # パスワードリセット完了用URL
    "PASSWORD_RESET_CONFIRM_URL": "settings/auth/confirm-password/?uid={uid}&token={token}",
    # カスタムユーザー用シリアライザー
    "SERIALIZERS": {
        "user_create": "apps.staff_hub.serializers.UserSerializer",
        "user": "apps.staff_hub.serializers.UserSerializer",
        "current_user": "apps.staff_hub.serializers.UserSerializer",
    },
    "EMAIL": {
        # アクティベート
        "activation": "apps.staff_hub.templates.activation.ActivationEmail",
        # アクティベート完了
        "confirmation": "apps.staff_hub.templates.confirmation.ConfirmationEmail",
        # パスワード変更
        "password_reset": "apps.staff_hub.templates.password_reset.PasswordResetEmail",
        # パスワード変更完了
        "password_changed_confirmation": "apps.staff_hub.templates.password_changed_confirmation.PasswordChangedConfirmationEmail",
        # メールアドレス変更（モデルを変更しているためユーザーネームではない）
        "username_reset": "apps.staff_hub.templates.username_reset.UsernameResetEmail",
        # メールアドレス変更完了（モデルを変更しているためユーザーネームではない）
        "username_changed_confirmation": "apps.staff_hub.templates.username_changed_confirmation.UsernameChangedConfirmationEmail",
    },
}

# カスタムユーザーモデルの使用を指定
AUTH_USER_MODEL = "staff_hub.User"

# メール送信設定
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD")
EMAIL_PORT = 587
EMAIL_USE_TLS = True

DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
CORS_ALLOW_CREDENTIALS = True
