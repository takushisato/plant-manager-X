from django.db import models
from apps.staff_hub.models import User
from .mail_group import MailGroup
from apps.utility.models import BaseModel


class MailGroupDetail(BaseModel):
    mail_group_detail = models.ForeignKey(MailGroup, on_delete=models.CASCADE, verbose_name="メールの宛先グループ")
    create_user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="送信先ユーザー")

    class Meta:
        verbose_name = "メールの宛先グループ詳細"
        verbose_name_plural = "メールの宛先グループ詳細"
        db_table = "mail_group_details"

    def __str__(self):
        return f"{self.mail_group_detail.group_title} - {self.create_user.name}"

    def delete(self, *args, **kwargs):
        # 論理削除ではなく、物理削除を強制
        super().delete(*args, **kwargs)
