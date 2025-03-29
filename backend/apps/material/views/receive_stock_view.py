from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from rest_framework.exceptions import ValidationError
from apps.material.models.material import Material
from apps.material.serializers import ReceiveStockSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.material.common import check_material_access_permission
from drf_spectacular.utils import extend_schema
from apps.utility.const import MESSAGES


@extend_schema(
    request=ReceiveStockSerializer,
    responses={200: None},
    description="資材の在庫数を受け入れ数分だけ増加させます。",
    tags=["materials"]
)
class ReceiveStockView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @transaction.atomic
    def put(self, request, pk):
        check_material_access_permission(request)
        material = Material.get_locked(pk)
        added_qty = _validate_receive_stock_request(request)
        _validate_added_qty(added_qty)
        current_stock = _apply_received_stock(material, added_qty)

        return Response({
            "detail": MESSAGES["RECEIVE_STOCK"].format(added_qty=added_qty),
            "current_stock": current_stock
        }, status=status.HTTP_200_OK)
    

def _validate_receive_stock_request(request):
    """
    受け入れ数のバリデーション
    """
    serializer = ReceiveStockSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data["added_qty"]


def _validate_added_qty(added_qty):
    """
    追加数量のバリデーション（0以下は禁止）
    """
    if added_qty <= 0:
        raise ValidationError(MESSAGES["RECEIVE_STOCK_ERROR"])


def _apply_received_stock(material, added_qty):
    """
    受け入れ数の適用
    """
    material.stock_qty += added_qty
    material.save()
    return material.stock_qty