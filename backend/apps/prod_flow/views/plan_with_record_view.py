from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema
from apps.prod_flow.serializer import PlanWithRecordSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from apps.prod_flow.common import check_prod_flow_edit_permission


class PlanWithRecordView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=PlanWithRecordSerializer,
        responses={201: PlanWithRecordSerializer},
        tags=["production"],
        description="生産計画と詳細を一括で作成",
    )
    def post(self, request):
        check_prod_flow_edit_permission(request)

        serializer = PlanWithRecordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = serializer.save()

        return Response(
            PlanWithRecordSerializer(plan).data, status=status.HTTP_201_CREATED
        )
