from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
from drf_spectacular.utils import extend_schema
from apps.attendance.models.record import Record
from apps.attendance.serializers import RecordListSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.attendance.common import check_attendance_all_edit_permission
from rest_framework.exceptions import ValidationError


class AttendanceRecordAllListView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        tags=["attendance"],
        description="全ユーザーの勤怠記録を月指定で取得（管理者用）",
        responses={200: RecordListSerializer(many=True)}
    )
    def get(self, request):
        check_attendance_all_edit_permission(request)

        month_str = request.query_params.get("month")
        _validate_month_param_exists(month_str)
        month = _parse_month_string(month_str)

        start_date, end_date = _get_month_range(month)

        records = Record.objects.filter(
            work_date__gte=start_date,
            work_date__lt=end_date,
            deleted_at__isnull=True
        ).select_related("user", "work_pattern")

        serializer = RecordListSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

def _validate_month_param_exists(month_str):
    """
    月のパラメータが存在するかどうかをチェックする
    """
    if not month_str:
        raise ValidationError("month パラメータは必須です。")


def _parse_month_string(month_str):
    """
    月のパラメータをパースする
    """
    try:
        return datetime.strptime(month_str, "%Y-%m")
    except ValueError:
        raise ValidationError("無効な月の形式です。YYYY-MM の形式で指定してください。")


def _get_month_range(month: datetime):
    """
    月の範囲を取得する
    """
    start_date = month.replace(day=1)
    if month.month == 12:
        end_date = month.replace(year=month.year + 1, month=1, day=1)
    else:
        end_date = month.replace(month=month.month + 1, day=1)
    return start_date, end_date