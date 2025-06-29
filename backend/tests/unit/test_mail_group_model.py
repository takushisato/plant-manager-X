import pytest
from apps.mail.models.mail_group import MailGroup
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.user_factory import UserFactory


@pytest.mark.django_db
def test_create_mail_group_with_factory():
    """
    MailGroupFactory で正しく作成できることを確認
    """
    group = MailGroupFactory()
    assert group.create_user is not None
    assert isinstance(group.group_title, str)
    assert isinstance(group.note, str)


@pytest.mark.django_db
def test_mail_group_str_method():
    """
    __str__ が group_title を返すことを確認
    """
    group = MailGroupFactory(group_title="開発チーム")
    assert str(group) == "開発チーム"


@pytest.mark.django_db
def test_mail_group_full_fields_create():
    """
    すべてのフィールドに値が入っていても正しく作成できることを確認
    """
    user = UserFactory(name="管理者 太郎")
    group = MailGroup.objects.create(
        create_user=user, group_title="営業チーム", note="全営業担当者向け"
    )
    assert group.create_user.name == "管理者 太郎"
    assert group.group_title == "営業チーム"
    assert group.note == "全営業担当者向け"
