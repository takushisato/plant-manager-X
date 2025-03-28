from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.db import transaction
from django.shortcuts import get_object_or_404

from apps.material.models.material import Material
from apps.material.serializers import ReceiveStockSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.material.common import check_material_access_permission


class ReceiveStockView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @transaction.atomic
    def post(self, request, pk):
        check_material_access_permission(request)

        material = get_object_or_404(Material.objects.select_for_update(), pk=pk)

        serializer = ReceiveStockSerializer(data=request.data)
        if serializer.is_valid():
            added_qty = serializer.validated_data["added_qty"]
            material.stock_qty += added_qty
            material.save()

            return Response({
                "detail": f"{added_qty} 個受け入れました。",
                "現在の在庫数": material.stock_qty
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
