import pytest
from datetime import datetime
from apps.mail.models.mail_history import MailHistory
from tests.factory.mail_template_factory import MailTemplateFactory
from tests.factory.mail_group_factory import MailGroupFactory


@pytest.mark.django_db
def test_create_mail_template_with_factory():
    """
    MailTemplateFactory を使って正常にインスタンスが作成されることを確認
    """
    template = MailTemplateFactory()
    assert template.mail_group is not None
    assert isinstance(template.sent_at, datetime)
    assert isinstance(template.title, str)
    assert isinstance(template.message, str)


@pytest.mark.django_db
def test_mail_template_str_method():
    """
    __str__ が title を返すことを確認
    """
    template = MailTemplateFactory(title="定期メンテナンスのお知らせ")
    assert str(template) == "定期メンテナンスのお知らせ"


@pytest.mark.django_db
def test_mail_template_all_fields():
    """
    すべてのフィールドが指定された状態でも正常に保存できることを確認
    """
    group = MailGroupFactory(group_title="重要通知")
    template = MailHistory.objects.create(
        mail_group=group,
        sent_at=datetime(2025, 4, 1, 10, 0),
        title="納期遅延のお知らせ",
        message="納期が1日遅れます。ご了承ください。"
    )
    assert template.mail_group.group_title == "重要通知"
    assert template.title == "納期遅延のお知らせ"
    assert "遅れます" in template.message
