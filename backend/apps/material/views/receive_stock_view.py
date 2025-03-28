from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from django.core.exceptions import ValidationError
from apps.material.models.material import Material
from apps.material.serializers import ReceiveStockSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.material.common import check_material_access_permission


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
            "detail": f"{added_qty} 個受け入れました。",
            "現在の在庫数": current_stock
        }, status=status.HTTP_200_OK)
    

def _validate_receive_stock_request(request):
    serializer = ReceiveStockSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data["added_qty"]


def _validate_added_qty(added_qty):
    """
    追加数量のバリデーション（0以下は禁止）
    """
    if added_qty <= 0:
        raise ValidationError("受け入れ数は 1 以上である必要があります。")


def _apply_received_stock(material, added_qty):
    material.stock_qty += added_qty
    material.save()
    return material.stock_qty