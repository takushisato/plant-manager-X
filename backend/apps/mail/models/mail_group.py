from django.db import models
from apps.utility.models import BaseModel
from apps.staff_hub.models import User


class MailGroup(BaseModel):
    create_user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="作成者")
    group_title = models.CharField("グループ名", max_length=255)
    note = models.CharField("備考", max_length=1000, null=True, blank=True)

    class Meta:
        verbose_name = "メールの宛先グループ"
        verbose_name_plural = "メールの宛先グループ"
        db_table = "mail_groups"

    def __str__(self):
        return self.group_title
