from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from drf_spectacular.utils import extend_schema
from apps.attendance.models.record import Record
from apps.attendance.serializers import RecordListSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.attendance.common import check_attendance_own_edit_permission
from rest_framework import status
from apps.attendance.views.validations import validate_month_param_exists, get_month_range_from_str


class AttendanceRecordMyListView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        tags=["attendance"],
        description="月を指定して自分の勤怠記録を取得",
        responses={200: RecordListSerializer(many=True)}
    )
    def get(self, request):
        check_attendance_own_edit_permission(request)

        month_str = request.query_params.get("month")
        error_response = validate_month_param_exists(month_str)
        if error_response:
            return error_response

        try:
            start_date, end_date = get_month_range_from_str(month_str)
        except ValueError:
            return Response(
                {"detail": "無効な月の形式です。yyyy-mm 形式で指定してください。"},
                status=status.HTTP_400_BAD_REQUEST
            )

        records = Record.objects.filter(
            user=request.user,
            work_date__gte=start_date,
            work_date__lt=end_date,
            deleted_at__isnull=True
        ).order_by("work_date")

        serializer = RecordListSerializer(records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

