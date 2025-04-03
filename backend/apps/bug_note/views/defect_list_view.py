from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from apps.staff_hub.permission import HasUserPermissionObject
from apps.bug_note.common import check_bug_note_view_permission
from apps.bug_note.models.defect import Defect
from apps.bug_note.serializers import DefectListSerializer


class DefectListView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        responses={200: DefectListSerializer(many=True)},
        tags=["defect"],
        description="不具合を一覧で取得"
    )
    def get(self, request):
        check_bug_note_view_permission(request)
        defects = Defect.get_defects_by_month()
        serializer = DefectListSerializer(defects, many=True)
        return Response(serializer.data)
