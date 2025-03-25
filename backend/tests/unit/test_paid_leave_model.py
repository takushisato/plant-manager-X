import pytest
from apps.attendance.models.paid_leave import PaidLeave
from tests.factory.paid_leave_factory import PaidLeaveFactory
from tests.factory.user_factory import UserFactory
from django.db import IntegrityError

@pytest.mark.django_db
def test_create_paid_leave_with_factory():
    """
    PaidLeaveFactory で正しくインスタンスが作成されることを確認
    """
    paid_leave = PaidLeaveFactory()
    assert paid_leave.user is not None
    assert isinstance(paid_leave.paid_leave_days, int)
    assert paid_leave.paid_leave_days >= 0


@pytest.mark.django_db
def test_paid_leave_str_method():
    """
    __str__ メソッドが 'ユーザー名 - 有給休暇日数' を返す
    """
    user = UserFactory(name="田中太郎")
    paid_leave = PaidLeave.objects.create(user=user, paid_leave_days=5)
    assert str(paid_leave) == "田中太郎 - 5"


@pytest.mark.django_db
def test_paid_leave_user_one_to_one_constraint():
    """
    同じユーザーに複数の PaidLeave を割り当てられないことを確認
    """
    user = UserFactory()
    PaidLeave.objects.create(user=user, paid_leave_days=10)

    with pytest.raises(IntegrityError):
        PaidLeave.objects.create(user=user, paid_leave_days=5)
