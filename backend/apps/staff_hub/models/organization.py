from django.db import models
from apps.utility.models import BaseModel

class Organization(BaseModel):
    """
    組織モデル
    """
    organization_name = models.CharField("組織名", max_length=255, unique=True)
    description = models.TextField("組織説明", blank=True, null=True)

    class Meta:
        verbose_name = '組織'
        verbose_name_plural = '組織'
        db_table = 'organizations'

    def __str__(self):
        return self.organization_name
