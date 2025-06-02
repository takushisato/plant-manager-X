from rest_framework import serializers
from apps.trade_flow.models.orders import Order


class OrderCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = [
            "customer", "order_number", "order_date", "product_name",
            "quantity", "price", "deadline", "note"
        ]


class OrderListSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.customer_name', read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_date', 'product_name', 'quantity',
            'price', 'deadline', 'note', 'customer', 'customer_name'
        ]

class OrderDetailSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.customer_name', read_only=True)
    customer = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'order_date', 'product_name', 'quantity',
            'price', 'deadline', 'note', 'customer', 'customer_name'
        ]

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance