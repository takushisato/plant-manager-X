from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.bug_note.models.defect import Defect
from apps.bug_note.serializers import DefectDetailSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.bug_note.common import check_bug_note_view_permission


class DefectDetailView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        responses={200: DefectDetailSerializer},
        tags=["defect"],
        description="指定されたIDの不具合情報を取得する"
    )
    def get(self, request, pk):
        check_bug_note_view_permission(request)
        defect = get_object_or_404(Defect, pk=pk, deleted_at__isnull=True)
        serializer = DefectDetailSerializer(defect)
        return Response(serializer.data, status=status.HTTP_200_OK)
