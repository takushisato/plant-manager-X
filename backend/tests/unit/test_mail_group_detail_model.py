import pytest
from apps.mail.models.mail_group_detail import MailGroupDetail
from tests.factory.mail_group_detail_factory import MailGroupDetailFactory
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.user_factory import UserFactory


@pytest.mark.django_db
def test_create_mail_group_detail_with_factory():
    """
    MailGroupDetailFactory で正しく作成できることを確認
    """
    detail = MailGroupDetailFactory()
    assert detail.mail_group_detail is not None
    assert detail.recipient_user is not None


@pytest.mark.django_db
def test_mail_group_detail_str_method():
    """
    __str__ メソッドが 'グループ名 - ユーザー名' を返すことを確認
    """
    user = UserFactory(name="田中一郎")
    group = MailGroupFactory(group_title="通知チーム")
    detail = MailGroupDetail.objects.create(
        mail_group_detail=group,
        recipient_user=user
    )
    assert str(detail) == "通知チーム - 田中一郎"


@pytest.mark.django_db
def test_mail_group_detail_physical_delete():
    """
    delete() が物理削除で動作することを確認
    """
    detail = MailGroupDetailFactory()
    pk = detail.pk
    detail.delete()

    with pytest.raises(MailGroupDetail.DoesNotExist):
        MailGroupDetail.objects.get(pk=pk)
