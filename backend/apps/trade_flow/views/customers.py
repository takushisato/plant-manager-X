from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.trade_flow.models.customer import Customer
from apps.trade_flow.serializers import CustomerListSerializer
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema
from apps.staff_hub.permission_check import HasUserPermissionObject


class CustomerView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        tags=["customer"],
        description="顧客一覧を取得する",
        responses={200: CustomerListSerializer(many=True)},
    )
    def get(self, request):
        customers = Customer.objects.all()
        serializer = CustomerListSerializer(customers, many=True)
        return Response(serializer.data)
