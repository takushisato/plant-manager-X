from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404
from django.utils import timezone

from apps.bug_note.models.defect import Defect
from apps.staff_hub.permission import HasUserPermissionObject
from apps.bug_note.common import check_bug_note_edit_permission


class DefectDeleteView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

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
