from django.db import models
from apps.utility.models import BaseModel
from apps.staff_hub.models.user import User


class MailGroup(BaseModel):
    create_user = models.ForeignKey(
        User, on_delete=models.CASCADE, verbose_name="作成者"
    )
    group_title = models.CharField("グループ名", max_length=255)
    note = models.CharField("備考", max_length=1000, null=True, blank=True)

    class Meta:
        verbose_name = "メールの宛先グループ"
        verbose_name_plural = "メールの宛先グループ"
        db_table = "mail_groups"

    def __str__(self):
        return self.group_title

    @staticmethod
    def get_with_records_by_user(user):
        """
        ユーザーが作成したメールグループとその詳細情報を取得
        """
        return MailGroup.objects.filter(create_user=user).prefetch_related(
            "mailgrouprecord_set"
        )
