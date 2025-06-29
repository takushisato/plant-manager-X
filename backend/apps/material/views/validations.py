from rest_framework.exceptions import ValidationError
from apps.material.serializers import ReceiveStockSerializer, UseStockSerializer
from apps.utility.const import MESSAGES


def validate_receive_stock_request(request):
    """
    受け入れ数のバリデーション
    """
    serializer = ReceiveStockSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data["added_qty"]


def validate_added_qty(added_qty):
    """
    追加数量のバリデーション（0以下は禁止）
    """
    if added_qty <= 0:
        raise ValidationError(MESSAGES["RECEIVE_STOCK_ERROR"])


def apply_received_stock(material, added_qty):
    """
    受け入れ数の適用
    """
    material.stock_qty += added_qty
    material.save()
    return material.stock_qty


def validate_use_stock_request(request):
    """
    資材使用量バリデーション
    """
    serializer = UseStockSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    return serializer.validated_data["used_qty"]


def apply_used_stock(material, used_qty):
    """
    資材使用量適用
    """
    material.stock_qty -= used_qty
    material.save()
    return material.stock_qty


def validate_used_qty(material, used_qty):
    """
    在庫超過チェック
    """
    if used_qty > material.stock_qty:
        raise ValidationError(MESSAGES["USE_STOCK_ERROR"])
