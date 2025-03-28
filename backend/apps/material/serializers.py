from rest_framework import serializers
from rest_framework import serializers
from apps.material.models.material import Material


class UseStockSerializer(serializers.Serializer):
    used_qty = serializers.IntegerField(min_value=1)
    

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = [
            "id", "organization", "material_name", "material_price",
            "stock_qty", "order_suggestion_qty",
        ]


class ReceiveStockSerializer(serializers.Serializer):
    added_qty = serializers.IntegerField()