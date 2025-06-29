import pytest
from apps.mail.models.mail_group_record import MailGroupRecord
from tests.factory.mail_group_record_factory import MailGroupRecordFactory
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.user_factory import UserFactory


@pytest.mark.django_db
def test_create_mail_group_record_with_factory():
    """
    MailGroupRecordFactory で正しく作成できることを確認
    """
    record = MailGroupRecordFactory()
    assert record.mail_group_record is not None
    assert record.recipient_user is not None


@pytest.mark.django_db
def test_mail_group_record_str_method():
    """
    __str__ メソッドが 'グループ名 - ユーザー名' を返すことを確認
    """
    user = UserFactory(name="田中一郎")
    group = MailGroupFactory(group_title="通知チーム")
    record = MailGroupRecord.objects.create(
        mail_group_record=group, recipient_user=user
    )
    assert str(record) == "通知チーム - 田中一郎"


@pytest.mark.django_db
def test_mail_group_record_physical_delete():
    """
    delete() が物理削除で動作することを確認
    """
    record = MailGroupRecordFactory()
    pk = record.pk
    record.delete()

    with pytest.raises(MailGroupRecord.DoesNotExist):
        MailGroupRecord.objects.get(pk=pk)


@pytest.mark.django_db
def test_bulk_create_records():
    """
    bulk_create_records で複数ユーザーの詳細が一括作成されることを確認
    """
    group = MailGroupFactory()
    users = UserFactory.create_batch(3)

    records = MailGroupRecord.bulk_create_records(mail_group=group, users=users)

    assert len(records) == 3
    for record, user in zip(records, users):
        assert record.mail_group_record == group
        assert record.recipient_user == user

    # 実際にDBに保存されているか確認
    saved = MailGroupRecord.objects.filter(mail_group_record=group)
    assert saved.count() == 3


@pytest.mark.django_db
def test_get_mail_group_records_by_mail_group():
    """
    get_mail_group_records_by_mail_group で指定グループの詳細のみ取得されることを確認
    """
    group1 = MailGroupFactory()
    group2 = MailGroupFactory()
    user1 = UserFactory()
    user2 = UserFactory()

    MailGroupRecord.objects.create(mail_group_record=group1, recipient_user=user1)
    MailGroupRecord.objects.create(mail_group_record=group2, recipient_user=user2)

    results = MailGroupRecord.get_mail_group_records_by_mail_group(group1)
    assert results.count() == 1
    assert results.first().recipient_user == user1
