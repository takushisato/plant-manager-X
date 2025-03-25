from django.db import models
from apps.utility.models import BaseModel
from .mail_group import MailGroup


class MailTemplate(BaseModel):
    mail_group = models.ForeignKey(MailGroup, on_delete=models.CASCADE, verbose_name="メールの宛先グループ")
    sent_at = models.DateTimeField("送信日時")
    title = models.CharField("タイトル", max_length=255)
    message = models.TextField("メッセージ")

    class Meta:
        verbose_name = "メールテンプレート"
        verbose_name_plural = "メールテンプレート"
        db_table = "mail_templates"

    def __str__(self):
        return self.title

