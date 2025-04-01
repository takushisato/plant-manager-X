from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema

from apps.trade_flow.models.orders import Order
from apps.trade_flow.serializers import OrderCreateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.trade_flow.common import check_trade_flow_edit_permission


class OrderUpdateView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=OrderCreateSerializer,
        responses={200: OrderCreateSerializer},
        tags=["order"],
        description="注文情報を更新する"
    )
    def put(self, request, pk):
        check_trade_flow_edit_permission(request)

        order = get_object_or_404(Order, pk=pk)
        serializer = OrderCreateSerializer(order, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
