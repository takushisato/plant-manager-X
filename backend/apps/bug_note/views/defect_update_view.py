from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404

from apps.bug_note.models.defect import Defect
from apps.bug_note.serializers import DefectUpdateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.bug_note.common import check_bug_note_edit_permission

class DefectUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

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
