from rest_framework import serializers

class UseStockSerializer(serializers.Serializer):
    used_qty = serializers.IntegerField(min_value=1)

    def validate_used_qty(self, value):
        material = self.context["material"]
        if value > material.stock_qty:
            raise serializers.ValidationError("在庫が不足しています。")
        return value
