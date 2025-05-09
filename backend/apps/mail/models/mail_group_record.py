from django.db import models
from apps.staff_hub.models.user import User
from .mail_group import MailGroup
from apps.utility.models import BaseModel


class MailGroupRecord(BaseModel):
    mail_group_record = models.ForeignKey(MailGroup, on_delete=models.CASCADE, verbose_name="メールの宛先グループ")
    recipient_user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="送信先ユーザー")

    class Meta:
        verbose_name = "メールの宛先グループ詳細"
        verbose_name_plural = "メールの宛先グループ詳細"
        db_table = "mail_group_details"

    def __str__(self):
        return f"{self.mail_group_record.group_title} - {self.recipient_user.name}"

    def delete(self, *args, **kwargs):
        # 論理削除ではなく、物理削除を強制
        super().delete(*args, **kwargs)
        

    @classmethod
    def bulk_create_records(cls, mail_group, users):
        """
        指定されたメールグループに、複数のユーザーを一括登録する
        """
        instances = [
            cls(mail_group_record=mail_group, recipient_user=user)
            for user in users
        ]
        return cls.objects.bulk_create(instances)
    
    
    @classmethod
    def get_mail_group_records_by_mail_group(cls, mail_group):
        """
        指定されたメールグループに紐づくメールグループ詳細を取得する
        """
        return cls.objects.filter(mail_group_record=mail_group)
