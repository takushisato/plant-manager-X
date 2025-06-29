from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.attendance.models.work_record import WorkRecord
from apps.attendance.serializers import WorkRecordUpdateSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from django.shortcuts import get_object_or_404
from apps.attendance.common import check_attendance_own_edit_permission
from apps.attendance.views.validations import (
    validate_clock_order,
    validate_within_work_pattern,
)


class RecordDetailView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=WorkRecordUpdateSerializer,
        responses={200: WorkRecordUpdateSerializer},
        tags=["attendance"],
        description="自分の勤怠記録を更新",
    )
    def put(self, request, pk):
        check_attendance_own_edit_permission(request)
        record = get_object_or_404(WorkRecord, pk=pk, deleted_at__isnull=True)

        serializer = WorkRecordUpdateSerializer(record, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        work_pattern = record.work_pattern

        start_time = data.get("start_time", record.start_time)
        end_time = data.get("end_time", record.end_time)

        validate_clock_order(start_time, end_time)
        validate_within_work_pattern(start_time, end_time, work_pattern)

        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
