from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.attendance.models.record import Record
from apps.attendance.serializers import RecordUpdateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from django.shortcuts import get_object_or_404
from apps.attendance.common import check_attendance_own_edit_permission
from apps.attendance.views.validations import validate_clock_order, validate_within_work_pattern


class AttendanceRecordUpdateView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=RecordUpdateSerializer,
        responses={200: RecordUpdateSerializer},
        tags=["attendance"],
        description="自分の勤怠記録を更新"
    )
    def put(self, request, pk):
        check_attendance_own_edit_permission(request)
        record = get_object_or_404(Record, pk=pk, deleted_at__isnull=True)

        serializer = RecordUpdateSerializer(record, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        work_pattern = record.work_pattern

        clock_in = data.get("clock_in_time", record.clock_in_time)
        clock_out = data.get("clock_out_time", record.clock_out_time)

        validate_clock_order(clock_in, clock_out)
        validate_within_work_pattern(clock_in, clock_out, work_pattern)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    