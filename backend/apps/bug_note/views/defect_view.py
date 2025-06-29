from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema

from apps.bug_note.serializers import DefectCreateSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from apps.bug_note.common import (
    check_bug_note_edit_permission,
    check_bug_note_view_permission,
)
from apps.bug_note.models.defect import Defect
from apps.bug_note.serializers import DefectListSerializer


class DefectView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=DefectCreateSerializer,
        responses={201: DefectCreateSerializer},
        tags=["defect"],
        description="不具合情報を新規作成する",
    )
    def post(self, request):
        check_bug_note_edit_permission(request)

        serializer = DefectCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        defect = serializer.save(create_user=request.user)

        return Response(
            DefectCreateSerializer(defect).data, status=status.HTTP_201_CREATED
        )

    @extend_schema(
        responses={200: DefectListSerializer(many=True)},
        tags=["defect"],
        description="不具合を一覧で取得",
    )
    def get(self, request):
        check_bug_note_view_permission(request)
        defects = Defect.get_defects_by_month()
        serializer = DefectListSerializer(defects, many=True)
        return Response(serializer.data)
