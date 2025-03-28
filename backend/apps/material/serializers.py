from rest_framework import serializers
from rest_framework import serializers
from apps.material.models.material import Material


class UseStockSerializer(serializers.Serializer):
    used_qty = serializers.IntegerField(min_value=1)

    def validate_used_qty(self, value):
        material = self.context["material"]
        if value > material.stock_qty:
            raise serializers.ValidationError("在庫が不足しています。")
        return value
    

class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = [
            "id", "organization", "material_name", "material_price",
            "stock_qty", "order_suggestion_qty",
        ]

class ReceiveStockSerializer(serializers.Serializer):
    added_qty = serializers.IntegerField(min_value=1)

    def validate_added_qty(self, value):
        if value <= 0:
            raise serializers.ValidationError("受け入れ数は 1 以上である必要があります。")
        return value