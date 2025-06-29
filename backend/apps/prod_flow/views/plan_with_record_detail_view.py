from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema
from apps.prod_flow.serializer import PlanWithRecordSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from apps.prod_flow.common import check_prod_flow_edit_permission
from apps.prod_flow.models.production_plan import ProductionPlan
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.prod_flow.models.production_plan_record import ProductionPlanRecord


class PlanWithRecordDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=PlanWithRecordSerializer,
        responses={200: PlanWithRecordSerializer},
        tags=["production"],
        description="生産計画と詳細を一括更新",
    )
    def put(self, request, pk):
        check_prod_flow_edit_permission(request)
        plan = get_object_or_404(ProductionPlan, pk=pk, deleted_at__isnull=True)

        serializer = PlanWithRecordSerializer(plan, data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = serializer.save()

        return Response(PlanWithRecordSerializer(plan).data, status=status.HTTP_200_OK)

    @extend_schema(
        tags=["production"],
        description="生産計画と詳細を論理削除する",
        responses={204: None},
    )
    def delete(self, request, pk):
        check_prod_flow_edit_permission(request)

        plan = get_object_or_404(ProductionPlan, pk=pk)

        plan.deleted_at = timezone.now()
        plan.save()

        ProductionPlanRecord.objects.filter(production_plan=plan).update(
            deleted_at=timezone.now()
        )

        return Response(status=status.HTTP_204_NO_CONTENT)
