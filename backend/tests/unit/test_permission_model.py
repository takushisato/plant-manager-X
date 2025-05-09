import pytest
from apps.staff_hub.models.permission import Permission
from tests.factory.permission_factory import PermissionFactory
from tests.factory.user_factory import UserFactory
from django.db import IntegrityError


@pytest.mark.django_db
def test_create_permission_with_factory():
    """
    PermissionFactory を使ってインスタンスが正しく作成されることを確認
    """
    permission = PermissionFactory(full_access=True)
    assert permission.user is not None
    assert permission.material_access is True
    assert permission.can_manage_own_attendance is True
    assert permission.can_manage_all_attendance is True
    assert permission.can_view_production_plan is True
    assert permission.can_edit_production_plan is True
    assert permission.can_view_order is True
    assert permission.can_edit_order is True
    assert permission.mail_access is True


@pytest.mark.django_db
def test_permission_str_method():
    """
    __str__ メソッドが user.name を返すこと
    """
    user = UserFactory(name="山田太郎")
    permission = Permission.objects.create(user=user)
    assert str(permission) == "山田太郎"


@pytest.mark.django_db
def test_user_permission_one_to_one_constraint():
    """
    同じユーザーに対して複数の Permission を作成できないことを確認
    """
    user = UserFactory()
    Permission.objects.create(user=user)

    with pytest.raises(IntegrityError):
        # 同じユーザーで2つ目を作成 → 失敗
        Permission.objects.create(user=user)