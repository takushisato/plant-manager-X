from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from apps.material.models.material import Material
from apps.material.serializers import ReceiveStockSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from apps.material.common import check_material_access_permission
from drf_spectacular.utils import extend_schema
from apps.utility.const import MESSAGES
from apps.material.views.validations import (
    validate_receive_stock_request,
    validate_added_qty,
    apply_received_stock,
)


@extend_schema(
    request=ReceiveStockSerializer,
    responses={200: None},
    description="資材の在庫数を受け入れ数分だけ増加させます。",
    tags=["materials"],
)
class ReceiveStockView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @transaction.atomic
    def put(self, request, pk):
        check_material_access_permission(request)
        material = Material.get_locked(pk)
        added_qty = validate_receive_stock_request(request)
        validate_added_qty(added_qty)
        current_stock = apply_received_stock(material, added_qty)

        return Response(
            {
                "detail": MESSAGES["RECEIVE_STOCK"].format(added_qty=added_qty),
                "current_stock": current_stock,
            },
            status=status.HTTP_200_OK,
        )
