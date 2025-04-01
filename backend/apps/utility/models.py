from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    """
    全モデルで共通で利用するフィールドを持つベースクラス
    """
    created_at = models.DateTimeField('作成日時', default=timezone.now)
    updated_at = models.DateTimeField('更新日時', auto_now=True, null=True)
    deleted_at = models.DateTimeField('削除日時', null=True, blank=True)
    
    class Meta:
        abstract = True
