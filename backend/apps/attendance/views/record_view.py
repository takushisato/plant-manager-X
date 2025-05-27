from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.attendance.models.work_record import WorkRecord
from apps.attendance.serializers import WorkRecordCreateSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from apps.attendance.common import check_attendance_own_edit_permission
from apps.attendance.views.validations import validate_clock_order, validate_within_work_pattern, calculate_minutes, get_total_break_minutes, calculate_net_work_minutes, validate_duplicate_record


class RecordView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=WorkRecordCreateSerializer,
        responses={201: WorkRecordCreateSerializer},
        tags=["attendance"],
        description="ログインユーザーの勤怠記録を新規作成"
    )
    def post(self, request):
        check_attendance_own_edit_permission(request)

        serializer = WorkRecordCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        start_time = data["start_time"]
        end_time = data["end_time"]
        work_pattern = data["work_pattern"]
        date = data["date"]
        user = request.user

        validate_clock_order(start_time, end_time)
        validate_within_work_pattern(start_time, end_time, work_pattern)
        validate_duplicate_record(user, date)
        work_duration = calculate_minutes(start_time, end_time)
        total_break = get_total_break_minutes(work_pattern)
        net_work_minutes = calculate_net_work_minutes(work_duration, total_break)

        attendance = WorkRecord.create_record(
            user=user,
            work_pattern=work_pattern,
            date=date,
            start_time=start_time,
            end_time=end_time,
            break_minutes=total_break,
            work_minutes=net_work_minutes,
            work_status=data["work_status"],
            note=data.get("note", "")
        )

        return Response(WorkRecordCreateSerializer(attendance).data, status=status.HTTP_201_CREATED)
