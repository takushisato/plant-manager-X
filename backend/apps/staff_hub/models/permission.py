from django.db import models
from apps.utility.models import BaseModel
from apps.staff_hub.models.user import User


class Permission(BaseModel):
    """
    権限モデル
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="ユーザー")
    material_access = models.BooleanField("資料アクセス：全体管理", default=False)
    can_manage_own_attendance = models.BooleanField("勤怠アクセス：自分のみ管理", default=False)
    can_manage_all_attendance = models.BooleanField("勤怠アクセス：全体管理", default=False)
    can_view_production_plan = models.BooleanField("生産計画アクセス：閲覧", default=False)
    can_edit_production_plan = models.BooleanField("生産計画アクセス：編集・削除", default=False)
    can_view_order = models.BooleanField("受注アクセス：閲覧", default=False)
    can_edit_order = models.BooleanField("受注アクセス：編集・削除", default=False)
    can_view_defect = models.BooleanField("不具合アクセス：閲覧", default=False)
    can_edit_defect = models.BooleanField("不具合アクセス：編集・削除", default=False)
    mail_access = models.BooleanField("メールアクセス：全体管理", default=False)

    class Meta:
        verbose_name = 'アクセス権限'
        verbose_name_plural = 'アクセス権限'
        db_table = 'permissions'

    def __str__(self):
        return self.user.name
