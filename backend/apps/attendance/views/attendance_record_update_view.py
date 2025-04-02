from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from drf_spectacular.utils import extend_schema

from apps.attendance.models.record import Record
from apps.attendance.serializers import RecordUpdateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied


class RecordUpdateView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=RecordUpdateSerializer,
        responses={200: RecordUpdateSerializer},
        tags=["attendance"],
        description="自分の勤怠記録を更新"
    )
    def put(self, request, pk):
        record = get_object_or_404(Record, pk=pk, deleted_at__isnull=True)

        if record.user != request.user:
            raise PermissionDenied("この勤怠記録を編集する権限がありません。")

        serializer = RecordUpdateSerializer(record, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
