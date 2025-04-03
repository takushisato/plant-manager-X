from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from apps.prod_flow.models.production_plan import ProductionPlan
from apps.prod_flow.serializer import ProductionPlanWithDetailsSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.prod_flow.common import check_prod_flow_view_permission


class ProductionPlanView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        responses={200: ProductionPlanWithDetailsSerializer(many=True)},
        tags=["production"],
        description="生産計画を詳細付きで一括取得"
    )
    def get(self, request):
        check_prod_flow_view_permission(request)
        plans = ProductionPlan.objects.prefetch_related("details").filter(deleted_at__isnull=True)
        serializer = ProductionPlanWithDetailsSerializer(plans, many=True)
        return Response(serializer.data)
