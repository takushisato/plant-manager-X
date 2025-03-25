from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
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




class UserManager(BaseUserManager):
    """
    User作成のメソッド

    通常のUserもしくはsuperuserを作成
    """
    def create_user(self, email, password=None, organization=None, **extra_fields):
        if not email:
            raise ValueError('メールアドレスは必須です')

        email = self.normalize_email(email)
        email = email.lower()
        user = self.model(email=email, organization=organization, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password=None, organization=None, **extra_fields):
        user = self.create_user(email, password, organization, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    """
    カスタムユーザーモデル
    """
    email = models.EmailField("メールアドレス", max_length=255, unique=True)
    name = models.CharField("ニックネーム", max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, verbose_name="組織", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        verbose_name = 'ユーザー情報'
        verbose_name_plural = 'ユーザー情報'
        db_table = 'users'

    def __str__(self):
        return self.email


class Permission(BaseModel):
    """
    権限モデル
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="ユーザー")
    staff_hub_access = models.BooleanField("人材管理アクセス", default=False)
    material_access = models.BooleanField("資料アクセス", default=False)
    attendance_access = models.BooleanField("勤怠アクセス", default=False)
    prod_flow_access = models.BooleanField("生産計画アクセス", default=False)
    trade_flow_access = models.BooleanField("受注アクセス", default=False)
    bug_note_access = models.BooleanField("不具合アクセス", default=False)
    mail_access = models.BooleanField("メールアクセス", default=False)
    master_data_access = models.BooleanField("マスタデータアクセス", default=False)

    class Meta:
        verbose_name = 'アクセス権限'
        verbose_name_plural = 'アクセス権限'
        db_table = 'permissions'

    def __str__(self):
        return self.user.name
