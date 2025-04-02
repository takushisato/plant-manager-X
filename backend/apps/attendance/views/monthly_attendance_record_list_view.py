from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date
from django.db.models import Q
from datetime import datetime
from drf_spectacular.utils import extend_schema
from apps.attendance.models.record import Record
from apps.attendance.serializers import RecordListSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.attendance.common import check_attendance_own_edit_permission


class MonthlyAttendanceRecordListView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        tags=["attendance"],
        description="月を指定して自分の勤怠記録を取得",
        responses={200: RecordListSerializer(many=True)}
    )
    def get(self, request):
        check_attendance_own_edit_permission(request)

        # ?month=2025-04 の形式で指定
        month_str = request.query_params.get("month")
        if not month_str:
            return Response({"detail": "クエリパラメータ `month` を指定してください（例: 2025-04）"}, status=400)

        try:
            year, month = map(int, month_str.split("-"))
            start_date = datetime(year, month, 1).date()
            if month == 12:
                end_date = datetime(year + 1, 1, 1).date()
            else:
                end_date = datetime(year, month + 1, 1).date()
        except ValueError:
            return Response({"detail": "無効な月の形式です。yyyy-mm 形式で指定してください。"}, status=400)

        records = Record.objects.filter(
            user=request.user,
            work_date__gte=start_date,
            work_date__lt=end_date,
            deleted_at__isnull=True
        ).order_by("work_date")

        serializer = RecordListSerializer(records, many=True)
        return Response(serializer.data, status=200)
