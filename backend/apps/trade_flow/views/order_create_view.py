from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiResponse

from apps.trade_flow.serializers import OrderCreateSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.trade_flow.common import check_trade_flow_edit_permission


class OrderCreateView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

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
