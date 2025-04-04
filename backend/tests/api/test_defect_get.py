import pytest
from rest_framework import status
from rest_framework.test import APIClient
from datetime import datetime, timedelta
from tests.factory.defect_factory import DefectFactory
from tests.factory.order_factory import OrderFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestDefectGet:
    """
    不具合一覧取得APIのテスト

    URL: /api/bug_note/defects/
    METHOD: GET
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_defect=True)
        return user

    @pytest.fixture
    def user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_defect=False)
        return user

    @pytest.fixture
    def defects(self, authed_user):
        order = OrderFactory()
        return DefectFactory.create_batch(
            3,
            create_user=authed_user,
            order=order,
            occurred_at=datetime.now(),
            submission_deadline=datetime.now() + timedelta(days=7)
        )

    def test_get_defects_success(self, client, authed_user, defects):
        """
        正常系: 不具合一覧を取得できる

        条件:
        - 認証されたユーザー
        - 不具合が3件存在する

        結果:
        - ステータスコード200
        - 不具合一覧が取得できる
        """
        client.force_authenticate(user=authed_user)
        response = client.get("/api/bug_note/defects/")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) == 3

    def test_get_defects_unauthenticated(self, client):
        """
        異常系: 未認証ユーザーは401

        条件:
        - 未認証ユーザー

        結果:
        - ステータスコード401
        """
        response = client.get("/api/bug_note/defects/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_defects_forbidden(self, client, user_without_permission):
        """
        異常系: 認証済みでも権限がない場合は403

        条件:
        - 権限がないユーザー

        結果:
        - ステータスコード403
        """
        client.force_authenticate(user=user_without_permission)
        response = client.get("/api/bug_note/defects/")
        assert response.status_code == status.HTTP_403_FORBIDDEN
