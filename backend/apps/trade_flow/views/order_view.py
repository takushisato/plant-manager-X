from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from apps.trade_flow.models.orders import Order
from apps.trade_flow.serializers import OrderListSerializer, OrderCreateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.trade_flow.common import check_trade_flow_view_permission, check_trade_flow_edit_permission
from rest_framework import status


class OrderView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        responses={200: OrderListSerializer(many=True)},
        tags=["order"],
        description="注文一覧を取得する"
    )
    def get(self, request):
        check_trade_flow_view_permission(request)
        orders = Order.objects.select_related("customer").filter(deleted_at__isnull=True)
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)

    @extend_schema(
        request=OrderCreateSerializer,
        responses={201: OrderCreateSerializer},
        tags=["order"],
        description="注文情報を新規作成する"
    )
    def post(self, request):
        check_trade_flow_edit_permission(request)
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderCreateSerializer(order).data, status=status.HTTP_201_CREATED)
