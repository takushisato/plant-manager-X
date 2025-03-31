from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema
from apps.prod_flow.serializer import ProductionPlanWithDetailsSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.prod_flow.common import check_prod_flow_access_permission
from apps.prod_flow.models.production_plan import ProductionPlan
from django.shortcuts import get_object_or_404


class ProductionPlanWithDetailsUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=ProductionPlanWithDetailsSerializer,
        responses={200: ProductionPlanWithDetailsSerializer},
        tags=["production"],
        description="生産計画と詳細を一括更新"
    )
    def put(self, request, pk):
        check_prod_flow_access_permission(request)

        plan = get_object_or_404(ProductionPlan, pk=pk)

        serializer = ProductionPlanWithDetailsSerializer(plan, data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = serializer.save()

        return Response(ProductionPlanWithDetailsSerializer(plan).data, status=status.HTTP_200_OK)
