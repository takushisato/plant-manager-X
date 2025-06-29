from django.db import models
from apps.utility.models import BaseModel
from .mail_group import MailGroup


class MailHistory(BaseModel):
    mail_group = models.ForeignKey(
        MailGroup, on_delete=models.CASCADE, verbose_name="メールの宛先グループ"
    )
    sent_at = models.DateTimeField("送信日時")
    title = models.CharField("タイトル", max_length=255)
    message = models.TextField("メッセージ")

    class Meta:
        verbose_name = "メール履歴"
        verbose_name_plural = "メール履歴"
        db_table = "mail_histories"

    def __str__(self):
        return self.title

    @classmethod
    def get_mail_history_by_user(cls, user):
        """
        メールグループに紐づくメール履歴を取得する
        """
        return cls.objects.filter(mail_group__create_user=user)
