from django.db import models
from apps.utility.models import BaseModel
from apps.staff_hub.models.organization import Organization
from django.shortcuts import get_object_or_404


class Material(BaseModel):
    """
    資材モデル
    """

    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, verbose_name="組織"
    )
    material_name = models.CharField("資材名", max_length=255)
    material_price = models.FloatField("資材価格", null=True, blank=True)
    stock_qty = models.IntegerField("在庫数", default=0)
    order_suggestion_qty = models.IntegerField("発注数量", default=0)

    class Meta:
        verbose_name = "資材"
        verbose_name_plural = "資材"
        db_table = "materials"

    def __str__(self):
        return self.material_name

    @classmethod
    def get_locked(cls, pk: int) -> "Material":
        """
        select_for_update 付きで排他ロック取得
        """
        return get_object_or_404(cls.objects.select_for_update(), pk=pk)
