from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from apps.prod_flow.models.production_plan import ProductionPlan
from apps.prod_flow.serializer import PlanWithRecordSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from apps.prod_flow.common import check_prod_flow_view_permission


class PlanView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        responses={200: PlanWithRecordSerializer(many=True)},
        tags=["production"],
        description="生産計画を詳細付きで一括取得"
    )
    def get(self, request):
        check_prod_flow_view_permission(request)
        plans = ProductionPlan.objects.prefetch_related("records").filter(deleted_at__isnull=True)
        serializer = PlanWithRecordSerializer(plans, many=True)
        return Response(serializer.data)
