from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.attendance.models.attendance_record import AttendanceRecord
from apps.attendance.serializers import AttendanceRecordCreateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.attendance.common import check_attendance_own_edit_permission


class MyAttendanceRecordCreateView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=AttendanceRecordCreateSerializer,
        responses={201: AttendanceRecordCreateSerializer},
        tags=["attendance"],
        description="ログインユーザーの勤怠記録を新規作成"
    )
    def post(self, request):
        check_attendance_own_edit_permission(request)

        serializer = AttendanceRecordCreateSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        attendance = serializer.save(user=request.user)

        return Response(AttendanceRecordCreateSerializer(attendance).data, status=status.HTTP_201_CREATED)
