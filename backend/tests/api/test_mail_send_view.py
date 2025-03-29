import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.core import mail

from apps.mail.models.mail_history import MailHistory
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.mail_group_detail_factory import MailGroupDetailFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestMailSendView:
    """
    メール送信APIのテスト

    URL: /api/mail/send/
    METHOD: POST
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def sender_user(self):
        user = UserFactory(email="sender@example.com")
        PermissionFactory(user=user, mail_access=True)
        return user

    @pytest.fixture
    def mail_group(self, sender_user):
        return MailGroupFactory(create_user=sender_user)

    @pytest.fixture
    def recipients(self, mail_group):
        users = UserFactory.create_batch(3)
        for user in users:
            user.email = f"{user.name}@example.com"
            user.save()
            MailGroupDetailFactory(mail_group_detail=mail_group, recipient_user=user)
        return users

    def test_send_mail_success(self, client, sender_user, mail_group, recipients):
        """
        正常系: メール送信が成功することを確認

        条件:
        - メール送信権限のあるユーザー
        - メールグループが存在する
        - メールアドレスが設定されている宛先ユーザーが存在する

        結果:
        - メール送信が成功する
        - メール履歴が保存される
        """
        client.force_authenticate(user=sender_user)

        data = {
            "mail_group_id": mail_group.id,
            "title": "お知らせ",
            "message": "これはテストメールです。"
        }

        response = client.post("/api/mail/send/", data=data, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "件のメールを送信しました" in response.data["detail"]
        assert len(mail.outbox) == 1  # 1通で複数人に送信
        assert MailHistory.objects.filter(mail_group=mail_group).exists()

    def test_send_mail_no_permission(self, client, mail_group):
        """
        異常系: メール送信権限のないユーザーがメール送信を試みる

        条件:
        - メール送信権限のないユーザー
        - メールグループが存在する

        結果:
        - メール送信が失敗する
        - 403エラーが返される
        """
        other_user = UserFactory()
        PermissionFactory(user=other_user, mail_access=True)
        client.force_authenticate(user=other_user)

        data = {
            "mail_group_id": mail_group.id,
            "title": "権限なし",
            "message": "送信できません"
        }

        response = client.post("/api/mail/send/", data=data, format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "送信権限" in response.data["detail"]

    def test_send_mail_no_recipients(self, client, sender_user, mail_group):
        """
        異常系: 宛先が存在しないメールグループに対してメール送信を試みる

        条件:
        - メール送信権限のあるユーザー
        - メールグループが存在する
        - 宛先ユーザーが存在しない

        結果:
        - メール送信が失敗する
        - 400エラーが返される
        """
        client.force_authenticate(user=sender_user)

        data = {
            "mail_group_id": mail_group.id,
            "title": "誰もいない",
            "message": "送信できません"
        }

        response = client.post("/api/mail/send/", data=data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "メールアドレスが設定されていません" in str(response.data)

    def test_send_mail_unauthenticated(self, client, mail_group):
        """
        異常系: 未ログインユーザーがメール送信を試みる

        条件:
        - 未ログイン
        - メールグループが存在する

        結果:
        - メール送信が失敗する
        - 401エラーが返される
        """
        data = {
            "mail_group_id": mail_group.id,
            "title": "未ログイン",
            "message": "送信できません"
        }

        response = client.post("/api/mail/send/", data=data, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
