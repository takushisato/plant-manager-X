from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from apps.staff_hub.permission import HasUserPermissionObject
from apps.trade_flow.models.orders import Order
from apps.trade_flow.common import check_trade_flow_edit_permission


class OrderDeleteView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        tags=["order"],
        description="注文情報を論理削除する",
        responses={204: None}
    )
    def delete(self, request, pk):
        check_trade_flow_edit_permission(request)

        order = get_object_or_404(Order, pk=pk, deleted_at__isnull=True)

        order.deleted_at = timezone.now()
        order.save()

        return Response(status=status.HTTP_204_NO_CONTENT)
