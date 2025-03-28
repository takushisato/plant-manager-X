from rest_framework import permissions
from apps.staff_hub.permission import HasUserPermissionObject
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from apps.material.models.material import Material
from apps.material.common import check_material_access_permission
from apps.material.serializers import UseStockSerializer


class UseStockView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @transaction.atomic
    def put(self, request, pk):
        check_material_access_permission(request)

        material = Material.get_locked(pk)
        used_qty = _validate_use_stock_request(request, material)
        remaining_stock = _apply_used_stock(material, used_qty)

        return Response({
            "detail": f"{used_qty} 個使用しました。",
            "残り在庫": remaining_stock
        }, status=status.HTTP_200_OK)


def _validate_use_stock_request(request, material):
    """
    資材使用量バリデーション
    """
    serializer = UseStockSerializer(data=request.data, context={"material": material})
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data["used_qty"]


def _apply_used_stock(material, used_qty):
    """
    資材使用量適用
    """
    material.stock_qty -= used_qty
    material.save()
    return material.stock_qty