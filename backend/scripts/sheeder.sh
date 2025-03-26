#!/bin/bash

# 組織データの読み込み
python manage.py loaddata organizations.json

# ユーザーデータの読み込み
python manage.py loaddata accounts.json

# 権限データの読み込み
python manage.py loaddata permissions.json

# 資材データの読み込み
python manage.py loaddata materials.json

# 勤務形態データの読み込み
python manage.py loaddata work_patterns.json

# 休憩時間設定データの読み込み
python manage.py loaddata break_settings.json

# 有給休暇データの読み込み
python manage.py loaddata paid_leaves.json

# 勤怠データの読み込み
python manage.py loaddata attendance_records.json

# 生産計画データの読み込み
python manage.py loaddata production_plans.json
