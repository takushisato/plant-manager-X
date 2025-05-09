from django.db import models
from apps.utility.models import BaseModel
from apps.staff_hub.models.organization import Organization
from apps.staff_hub.models.user import User


class OrganizationMember(BaseModel):
    """
    組織メンバーモデル
    """
    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        verbose_name="所属組織"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="ユーザー"
    )

    class Meta:
        verbose_name = '組織メンバー'
        verbose_name_plural = '組織メンバー'
        db_table = 'organization_members'

    def __str__(self):
        return f"{self.organization.organization_name} - {self.user.name}"
