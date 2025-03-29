import pytest
from rest_framework import status
from rest_framework.test import APIClient

from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from apps.mail.models.mail_group import MailGroup


@pytest.mark.django_db
class TestMailGroupCreateView:
    """
    メールグループ作成APIのテスト

    URL: /api/mail/groups/create/
    METHOD: POST
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, mail_access=True)
        return user

    @pytest.fixture
    def authed_user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, mail_access=False)
        return user

    def test_create_mail_group_success(self, client, authed_user_with_permission):
        """
        正常系: mail_access 権限のあるユーザーが作成可能

        条件:
        - mail_access 権限のあるユーザー
        - メールグループの作成

        結果:
        - ステータスコード201
        - メールグループが作成される
        """
        client.force_authenticate(user=authed_user_with_permission)

        mail_group_data = {
            "group_title": "品質管理チーム",
            "note": "新規立ち上げ用グループ"
        }

        response = client.post("/api/mail/groups/create/", data=mail_group_data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert MailGroup.objects.filter(group_title="品質管理チーム").exists()
        assert response.data["group_title"] == "品質管理チーム"

    def test_create_mail_group_forbidden(self, client, authed_user_without_permission):
        """
        異常系: mail_access 権限がないユーザーは作成不可（403）
        
        条件:
        - mail_access 権限がないユーザー
        - メールグループの作成

        結果:
        - ステータスコード403
        - メールグループが作成されない
        """
        client.force_authenticate(user=authed_user_without_permission)

        response = client.post("/api/mail/groups/create/", data={
            "group_title": "マーケティングチーム"
        })

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "権限" in str(response.data)

    def test_create_mail_group_unauthenticated(self, client):
        """
        異常系: 未ログインユーザーは401エラー

        条件:
        - 未ログインユーザー
        - メールグループの作成

        結果:
        - ステータスコード401
        - メールグループが作成されない
        """
        response = client.post("/api/mail/groups/create/", data={
            "group_title": "営業部グループ"
        })

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_mail_group_validation_error(self, client, authed_user_with_permission):
        """
        異常系: group_title が空だと400エラー

        条件:
        - mail_access 権限のあるユーザー
        - group_title が空

        結果:
        - ステータスコード400
        - group_title が空だと400エラー
        """
        client.force_authenticate(user=authed_user_with_permission)

        response = client.post("/api/mail/groups/create/", data={
            "group_title": ""
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "group_title" in response.data
