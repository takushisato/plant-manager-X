from apps.mail.models.mail_history import MailHistory
from django.utils import timezone
from rest_framework.exceptions import ValidationError, PermissionDenied
from apps.utility.const import MESSAGES


def validate_mail_group_ownership(mail_group, user):
    """
    ログインユーザーがグループの作成者か確認
    """
    if mail_group.create_user != user:
        raise PermissionDenied(MESSAGES["MAIL_GROUP_SEND_ERROR"])


def get_recipient_emails(recipients):
    """
    有効なメールアドレス一覧を取得
    """
    return [r.recipient_user.email for r in recipients if r.recipient_user.email]


def validate_recipient_emails(emails):
    """
    送信先が1件以上存在することを検証
    """
    if not emails:
        raise ValidationError(MESSAGES["SEND_MAIL_ERROR"])


def save_mail_template(mail_group, title, message):
    """
    メール送信履歴を保存
    """
    MailHistory.objects.create(
        mail_group=mail_group, sent_at=timezone.now(), title=title, message=message
    )


def validate_recipient_users(users):
    """
    recipient_users が空でないことを検証する
    """
    if not users:
        raise ValidationError(MESSAGES["MAIL_GROUP_DETAIL_BULK_CREATE_ERROR"])
