from rest_framework import serializers
from apps.attendance.models.attendance_record import AttendanceRecord
from apps.attendance.models.break_setting import BreakSetting
from datetime import datetime


class AttendanceRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        exclude = ['user', 'work_minutes', 'break_minutes']

    def validate(self, attrs):
        clock_in = attrs.get("clock_in_time")
        clock_out = attrs.get("clock_out_time")
        work_pattern = attrs.get("work_pattern")
        work_date = attrs.get("work_date")
        user = self.context["request"].user 

        _validate_clock_order(clock_in, clock_out)
        _validate_within_work_pattern(clock_in, clock_out, work_pattern)
        _validate_duplicate_record(user, work_date)
        work_duration = _calculate_minutes(clock_in, clock_out)
        total_break = _get_total_break_minutes(work_pattern)

        net_work_minutes = _calculate_net_work_minutes(work_duration, total_break)

        attrs["work_minutes"] = net_work_minutes
        attrs["break_minutes"] = total_break
        return attrs


def _validate_clock_order(clock_in, clock_out):
    """
    出勤時間と退勤時間の順番をチェック
    """
    if clock_out <= clock_in:
        raise serializers.ValidationError("退勤時間は出勤時間より後である必要があります。")


def _validate_within_work_pattern(clock_in, clock_out, work_pattern):
    """
    勤務時間が勤務形態の勤務時間外であるかどうかをチェック
    """
    if clock_in > work_pattern.start_time or clock_out < work_pattern.end_time:
        raise serializers.ValidationError("勤務時間が勤務形態の勤務時間外です。")


def _calculate_minutes(start, end):
    """
    時刻の差分を分単位で返す（datetime.time型対応）
    """
    base_date = datetime(2000, 1, 1)
    delta = datetime.combine(base_date, end) - datetime.combine(base_date, start)
    return int(delta.total_seconds() // 60)


def _get_total_break_minutes(work_pattern):
    """
    BreakSetting から該当の勤務形態の合計休憩時間を取得
    """
    breaks = BreakSetting.objects.filter(work_pattern=work_pattern)
    total = 0
    for b in breaks:
        total += _calculate_minutes(b.start_time, b.end_time)
    return total


def _calculate_net_work_minutes(work_duration, total_break):
    """
    勤務時間から休憩時間を引いた勤務時間を計算
    """
    net = work_duration - total_break
    if net < 0:
        raise serializers.ValidationError("休憩時間が勤務時間を超えています。")
    return net

def _validate_duplicate_record(user, work_date):
    """
    同じ勤務日に同じユーザーが勤怠記録を作成していないかをチェック
    """
    if AttendanceRecord.objects.filter(user=user, work_date=work_date, deleted_at__isnull=True).exists():
        raise serializers.ValidationError("この勤務日はすでに記録されています。")