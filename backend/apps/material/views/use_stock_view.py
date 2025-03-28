from rest_framework import permissions
from apps.staff_hub.permission import HasUserPermissionObject
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from apps.material.models.material import Material
from rest_framework.exceptions import PermissionDenied
from apps.material.serializers import UseStockSerializer


class UseStockView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @transaction.atomic
    def post(self, request, pk):
        _check_material_access_permission(request)

        material = Material.get_locked(pk)
        used_qty = _validate_use_stock_request(request, material)
        remaining_stock = _apply_used_stock(material, used_qty)

        return Response({
            "detail": f"{used_qty} 個使用しました。",
            "残り在庫": remaining_stock
        })


def _check_material_access_permission(request):
    """
    資材閲覧権限チェック
    """
    if not (request.permission.material_access or request.permission.master_data_access):
        raise PermissionDenied("認証は確認しましたが権限がありません。")


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