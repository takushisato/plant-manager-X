from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from apps.trade_flow.models.orders import Order
from apps.trade_flow.serializers import OrderListSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.trade_flow.common import check_trade_flow_view_permission


class OrderListView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        responses={200: OrderListSerializer(many=True)},
        tags=["order"],
        description="注文一覧を取得する"
    )
    def get(self, request):
        check_trade_flow_view_permission(request)
        orders = Order.objects.select_related("customer").all()
        serializer = OrderListSerializer(orders, many=True)
        return Response(serializer.data)
