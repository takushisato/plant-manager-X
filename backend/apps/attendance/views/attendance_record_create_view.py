from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.attendance.models.record import Record
from apps.attendance.serializers import RecordCreateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.attendance.common import check_attendance_own_edit_permission
from apps.attendance.models.break_setting import BreakSetting
from datetime import datetime
from rest_framework.exceptions import ValidationError


class AttendanceRecordCreateView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=RecordCreateSerializer,
        responses={201: RecordCreateSerializer},
        tags=["attendance"],
        description="ログインユーザーの勤怠記録を新規作成"
    )
    def post(self, request):
        check_attendance_own_edit_permission(request)

        serializer = RecordCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # View内でバリデーション処理実行
        clock_in = data["clock_in_time"]
        clock_out = data["clock_out_time"]
        work_pattern = data["work_pattern"]
        work_date = data["work_date"]
        user = request.user

        _validate_clock_order(clock_in, clock_out)
        _validate_within_work_pattern(clock_in, clock_out, work_pattern)
        _validate_duplicate_record(user, work_date)
        work_duration = _calculate_minutes(clock_in, clock_out)
        total_break = _get_total_break_minutes(work_pattern)
        net_work_minutes = _calculate_net_work_minutes(work_duration, total_break)

        # 勤怠レコードの作成
        attendance = Record.objects.create(
            user=user,
            work_pattern=work_pattern,
            work_date=work_date,
            clock_in_time=clock_in,
            clock_out_time=clock_out,
            break_minutes=total_break,
            work_minutes=net_work_minutes,
            work_status=data["work_status"],
            note=data.get("note", "")
        )

        return Response(RecordCreateSerializer(attendance).data, status=status.HTTP_201_CREATED)
    
def _validate_clock_order(clock_in, clock_out):
    """
    出勤時間と退勤時間の順番をチェック
    """
    if clock_out <= clock_in:
        raise ValidationError("退勤時間は出勤時間より後である必要があります。")

def _validate_within_work_pattern(clock_in, clock_out, work_pattern):
    """
    勤務時間が勤務形態の勤務時間外であるかどうかをチェック
    """
    if clock_in < work_pattern.start_time or clock_out > work_pattern.end_time:
        raise ValidationError("勤務時間が勤務形態の勤務時間外です。")

def _calculate_minutes(start, end):
    """
    出勤時間と退勤時間の差を分で計算
    """
    base = datetime(2000, 1, 1)
    return int((datetime.combine(base, end) - datetime.combine(base, start)).total_seconds() // 60)

def _get_total_break_minutes(work_pattern):
    """
    勤務形態の休憩時間を合計
    """
    breaks = BreakSetting.objects.filter(work_pattern=work_pattern)
    return sum(_calculate_minutes(b.start_time, b.end_time) for b in breaks)

def _calculate_net_work_minutes(work_duration, total_break):
    """
    勤務時間から休憩時間を引いた勤務時間を計算
    """
    net = work_duration - total_break
    if net < 0:
        raise ValidationError("休憩時間が勤務時間を超えています。")
    return net

def _validate_duplicate_record(user, work_date):
    """
    同じ勤務日に同じユーザーが勤怠記録を作成していないかをチェック
    """
    if Record.objects.filter(user=user, work_date=work_date, deleted_at__isnull=True).exists():
        raise ValidationError("この勤務日はすでに記録されています。")
