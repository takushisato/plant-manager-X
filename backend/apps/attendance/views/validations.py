from rest_framework.exceptions import ValidationError
from datetime import datetime
from apps.attendance.models.work_record import WorkRecord
from apps.attendance.models.break_setting import BreakSetting
from rest_framework.response import Response
from rest_framework import status
from apps.utility.const import MESSAGES


def validate_month_param(month_str):
    """
    月のパラメータが存在するかどうかをチェックする
    """
    if not month_str:
        raise ValidationError(MESSAGES["MONTH_PARAM_ERROR"])


def parse_month_string(month_str):
    """
    月のパラメータをパースする
    """
    try:
        return datetime.strptime(month_str, "%Y-%m")
    except ValueError:
        raise ValidationError(MESSAGES["INVALID_MONTH_FORMAT"])
    

def get_month_range(month: datetime):
    """
    月の範囲を取得する
    """
    start_date = month.replace(day=1)
    if month.month == 12:
        end_date = month.replace(year=month.year + 1, month=1, day=1)
    else:
        end_date = month.replace(month=month.month + 1, day=1)
    return start_date, end_date


def validate_clock_order(clock_in, clock_out):
    """
    出勤時間と退勤時間の順番をチェック
    """
    if clock_out <= clock_in:
        raise ValidationError(MESSAGES["CLOCK_ORDER_ERROR"])
    

def validate_within_work_pattern(clock_in, clock_out, work_pattern):
    """
    勤務時間が勤務形態の勤務時間外であるかどうかをチェック
    """
    if clock_in < work_pattern.start_time or clock_out > work_pattern.end_time:
        raise ValidationError(MESSAGES["WORK_PATTERN_ERROR"])


def calculate_minutes(start, end):
    """
    出勤時間と退勤時間の差を分で計算
    """
    base = datetime(2000, 1, 1)
    return int((datetime.combine(base, end) - datetime.combine(base, start)).total_seconds() // 60)


def get_total_break_minutes(work_pattern):
    """
    勤務形態の休憩時間を合計
    """
    breaks = BreakSetting.objects.filter(work_pattern=work_pattern)
    return sum(calculate_minutes(b.start_time, b.end_time) for b in breaks)


def calculate_net_work_minutes(work_duration, total_break):
    """
    勤務時間から休憩時間を引いた勤務時間を計算
    """
    net = work_duration - total_break
    if net < 0:
        raise ValidationError(MESSAGES["BREAK_TIME_ERROR"])
    return net


def validate_duplicate_record(user, date):
    """
    同じ勤務日に同じユーザーが勤怠記録を作成していないかをチェック
    """
    if WorkRecord.objects.filter(user=user, date=date, deleted_at__isnull=True).exists():
        raise ValidationError(MESSAGES["DUPLICATE_RECORD_ERROR"])


def validate_month_param_exists(month_str):
    """
    月のパラメータが存在するかどうかをチェックする
    """
    if not month_str:
        return Response(
            {"detail": MESSAGES["MONTH_PARAM_ERROR"]},
            status=status.HTTP_400_BAD_REQUEST
        )
    return None


def get_month_range_from_str(month_str):
    """
    "2025-04" のような文字列から (start_date, end_date) の日付ペアを返す
    """
    year, month = map(int, month_str.split("-"))
    start_date = datetime(year, month, 1).date()
    end_date = datetime(year + 1, 1, 1).date() if month == 12 else datetime(year, month + 1, 1).date()
    return start_date, end_date

