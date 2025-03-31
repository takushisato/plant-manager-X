from rest_framework import serializers
from apps.trade_flow.models.orders import Order


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "customer", "order_number", "order_date", "product_name",
            "quantity", "price", "deadline", "note"
        ]
