import pytest
from rest_framework import status
from rest_framework.test import APIClient
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.mail_group_record_factory import MailGroupRecordFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory

@pytest.mark.django_db
class TestMailGroupGet:
    """
    メールグループ一覧取得APIのテスト

    URL: /api/mail/groups/
    METHOD: GET
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

    @pytest.fixture
    def mail_groups_with_details(self, authed_user_with_permission):
        groups = MailGroupFactory.create_batch(2, create_user=authed_user_with_permission)
        for group in groups:
            MailGroupRecordFactory.create_batch(3, mail_group_record=group)
        return groups

    def test_list_success(self, client, authed_user_with_permission, mail_groups_with_details):
        """
        正常系: mail_access 権限があるユーザーは自身のグループと詳細を取得できる

        条件:
        - mail_access 権限があるユーザー
        - 自身のグループと詳細

        結果:
        - ステータスコード200
        - メールグループ一覧が取得できる
        - 自身のグループと詳細が取得できる
        """
        client.force_authenticate(user=authed_user_with_permission)
        response = client.get("/api/mail/groups/")

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) == 2
        assert "records" in response.data[0]

    def test_list_forbidden_without_permission(self, client, authed_user_without_permission):
        """
        異常系: mail_access 権限がないユーザーは 403

        条件:
        - mail_access 権限がないユーザー

        結果:
        - ステータスコード403
        - メールグループ一覧が取得できない
        """
        client.force_authenticate(user=authed_user_without_permission)
        response = client.get("/api/mail/groups/")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "権限" in str(response.data)

    def test_list_unauthenticated(self, client):
        """
        異常系: 未ログインユーザーは 401

        条件:
        - 未ログインユーザー

        結果:
        - ステータスコード401
        - メールグループ一覧が取得できない
        """
        response = client.get("/api/mail/groups/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
