from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models
from apps.utility.const import MESSAGES
from apps.utility.models import BaseModel
from apps.staff_hub.models.organization import Organization


class UserManager(BaseUserManager):
    """
    User作成のメソッド

    通常のUserもしくはsuperuserを作成
    """
    def create_user(self, email, password=None, organization=None, **extra_fields):
        if not email:
            raise ValueError(MESSAGES["EMAIL_REQUIRED"])

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
    name = models.CharField("名前", max_length=255)
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

