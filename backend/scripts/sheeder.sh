#!/bin/bash

# 組織データの読み込み
python manage.py loaddata organizations.json

# ユーザーデータの読み込み
python manage.py loaddata accounts.json

# 権限データの読み込み
python manage.py loaddata permissions.json
