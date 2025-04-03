from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.bug_note.models.defect import Defect
from apps.bug_note.serializers import DefectDetailSerializer, DefectUpdateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.bug_note.common import check_bug_note_view_permission, check_bug_note_edit_permission
from django.utils import timezone


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

    @extend_schema(
        request=DefectUpdateSerializer,
        responses={200: DefectUpdateSerializer},
        tags=["defect"],
        description="不具合を編集"
    )
    def put(self, request, pk):
        check_bug_note_edit_permission(request)

        defect = get_object_or_404(Defect, pk=pk)
        serializer = DefectUpdateSerializer(defect, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=["defect"],
        description="不具合を論理削除する",
        responses={204: None}
    )
    def delete(self, request, pk):
        check_bug_note_edit_permission(request)
        defect = get_object_or_404(Defect, pk=pk, deleted_at__isnull=True)
        defect.deleted_at = timezone.now()
        defect.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
