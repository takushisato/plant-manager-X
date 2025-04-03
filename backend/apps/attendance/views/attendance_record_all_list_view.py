from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from apps.attendance.models.record import Record
from apps.attendance.serializers import RecordListSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.attendance.common import check_attendance_all_edit_permission
from apps.attendance.views.validations import validate_month_param, parse_month_string, get_month_range


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
        validate_month_param(month_str)
        month = parse_month_string(month_str)

        start_date, end_date = get_month_range(month)

        records = Record.objects.filter(
            work_date__gte=start_date,
            work_date__lt=end_date,
            deleted_at__isnull=True
        ).select_related("user", "work_pattern")

        serializer = RecordListSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
