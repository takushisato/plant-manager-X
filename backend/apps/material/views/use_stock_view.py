from rest_framework import permissions
from apps.staff_hub.permission import HasUserPermissionObject
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from apps.material.models.material import Material
from apps.material.common import check_material_access_permission
from apps.material.serializers import UseStockSerializer
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema
from apps.utility.const import MESSAGES


@extend_schema(
    request=UseStockSerializer,
    responses={200: None},
    description="資材の在庫数を使用数分だけ減少させます。",
    tags=["materials"]
)
class UseStockView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @transaction.atomic
    def put(self, request, pk):
        check_material_access_permission(request)

        material = Material.get_locked(pk)
        used_qty = _validate_use_stock_request(request)
        _validate_used_qty(material, used_qty)
        remaining_stock = _apply_used_stock(material, used_qty)

        return Response({
            "detail": MESSAGES["USE_STOCK"].format(used_qty=used_qty),
            "current_stock": remaining_stock
        }, status=status.HTTP_200_OK)


def _validate_use_stock_request(request):
    """
    資材使用量バリデーション
    """
    serializer = UseStockSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data["used_qty"]


def _apply_used_stock(material, used_qty):
    """
    資材使用量適用
    """
    material.stock_qty -= used_qty
    material.save()
    return material.stock_qty


def _validate_used_qty(material, used_qty):
    """
    在庫超過チェック
    """
    if used_qty > material.stock_qty:
        raise ValidationError(MESSAGES["USE_STOCK_ERROR"])