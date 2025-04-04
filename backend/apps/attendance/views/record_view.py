from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.attendance.models.record import Record
from apps.attendance.serializers import RecordCreateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.attendance.common import check_attendance_own_edit_permission
from apps.attendance.views.validations import validate_clock_order, validate_within_work_pattern, calculate_minutes, get_total_break_minutes, calculate_net_work_minutes, validate_duplicate_record


class RecordView(APIView):
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

        clock_in = data["clock_in_time"]
        clock_out = data["clock_out_time"]
        work_pattern = data["work_pattern"]
        work_date = data["work_date"]
        user = request.user

        validate_clock_order(clock_in, clock_out)
        validate_within_work_pattern(clock_in, clock_out, work_pattern)
        validate_duplicate_record(user, work_date)
        work_duration = calculate_minutes(clock_in, clock_out)
        total_break = get_total_break_minutes(work_pattern)
        net_work_minutes = calculate_net_work_minutes(work_duration, total_break)

        attendance = Record.create_record(
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
    