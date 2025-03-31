from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404
from django.utils import timezone

from apps.prod_flow.models.production_plan import ProductionPlan
from apps.prod_flow.models.production_plan_detail import ProductionPlanDetail
from apps.staff_hub.permission import HasUserPermissionObject
from apps.prod_flow.common import check_prod_flow_edit_permission


class ProductionPlanDeleteView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        tags=["production"],
        description="生産計画と詳細を論理削除する",
        responses={204: None}
    )
    def delete(self, request, pk):
        check_prod_flow_edit_permission(request)

        plan = get_object_or_404(ProductionPlan, pk=pk)

        plan.deleted_at = timezone.now()
        plan.save()

        ProductionPlanDetail.objects.filter(production_plan=plan).update(
            deleted_at=timezone.now()
        )

        return Response(status=status.HTTP_204_NO_CONTENT)
