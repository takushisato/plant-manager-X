from rest_framework import permissions
from apps.staff_hub.permission import HasUserPermissionObject
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.shortcuts import get_object_or_404
from apps.material.models.material import Material
from apps.material.serializers import UseStockSerializer


class UseStockView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @transaction.atomic
    def post(self, request, pk):
        if not (request.permission.material_access or request.permission.master_data_access):
            return Response({"detail": "認証は確認しましたが権限がありません。"}, status=403)

        material = get_object_or_404(Material.objects.select_for_update(), pk=pk)

        serializer = UseStockSerializer(data=request.data, context={"material": material})
        if serializer.is_valid():
            used_qty = serializer.validated_data["used_qty"]
            material.stock_qty -= used_qty
            material.save()

            return Response({
                "detail": f"{used_qty} 個使用しました。",
                "残り在庫": material.stock_qty
            })

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
