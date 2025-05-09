from rest_framework import permissions
from apps.staff_hub.permission_check import HasUserPermissionObject
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from apps.material.models.material import Material
from apps.material.common import check_material_access_permission
from apps.material.serializers import UseStockSerializer
from drf_spectacular.utils import extend_schema
from apps.utility.const import MESSAGES
from apps.material.views.validations import validate_use_stock_request, validate_used_qty, apply_used_stock


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
        used_qty = validate_use_stock_request(request)
        validate_used_qty(material, used_qty)
        remaining_stock = apply_used_stock(material, used_qty)

        return Response({
            "detail": MESSAGES["USE_STOCK"].format(used_qty=used_qty),
            "current_stock": remaining_stock
        }, status=status.HTTP_200_OK)

