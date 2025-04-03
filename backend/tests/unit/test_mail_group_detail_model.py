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


@pytest.mark.django_db
def test_bulk_create_details():
    """
    bulk_create_details で複数ユーザーの詳細が一括作成されることを確認
    """
    group = MailGroupFactory()
    users = UserFactory.create_batch(3)

    details = MailGroupDetail.bulk_create_details(mail_group=group, users=users)

    assert len(details) == 3
    for detail, user in zip(details, users):
        assert detail.mail_group_detail == group
        assert detail.recipient_user == user

    # 実際にDBに保存されているか確認
    saved = MailGroupDetail.objects.filter(mail_group_detail=group)
    assert saved.count() == 3


@pytest.mark.django_db
def test_get_mail_group_details_by_mail_group():
    """
    get_mail_group_details_by_mail_group で指定グループの詳細のみ取得されることを確認
    """
    group1 = MailGroupFactory()
    group2 = MailGroupFactory()
    user1 = UserFactory()
    user2 = UserFactory()

    MailGroupDetail.objects.create(mail_group_detail=group1, recipient_user=user1)
    MailGroupDetail.objects.create(mail_group_detail=group2, recipient_user=user2)

    results = MailGroupDetail.get_mail_group_details_by_mail_group(group1)
    assert results.count() == 1
    assert results.first().recipient_user == user1