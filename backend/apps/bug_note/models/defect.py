from django.db import models
from apps.utility.models import BaseModel
from apps.staff_hub.models import User
from apps.trade_flow.models.orders import Order


class Defect(BaseModel):
    create_user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="作成者")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name="注文")
    occurred_at = models.DateTimeField("発生日時")
    title = models.CharField("タイトル", max_length=255)
    defect_detail = models.CharField("不具合詳細", max_length=2000)
    submission = models.CharField("対策", max_length=2000)
    submission_deadline = models.DateTimeField("対策期限")

    class Meta:
        verbose_name = "不具合連絡"
        verbose_name_plural = "不具合連絡"
        db_table = "defects"

    def __str__(self):
        return self.title
