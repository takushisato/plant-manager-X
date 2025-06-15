import pytest
from rest_framework.test import APIClient
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from rest_framework.authtoken.models import Token


@pytest.mark.django_db
class TestAllUsersView:
    """
    AllUsersViewのテスト

    URL: /api/auth/all_users/
    Method: GET
    """

    def test_all_users_view_with_permission(self):
        """
        正常系: ユーザーが権限を持っている場合のテスト

        条件:
        - ユーザーが権限を持っている

        結果:
        - ユーザー情報が取得できる
        """
        user = UserFactory.create()
        PermissionFactory.create(
            user=user,
            material_access=False,
            can_manage_own_attendance=True,
            can_manage_all_attendance=False,
            can_view_production_plan=True,
            can_edit_production_plan=False,
            can_view_order=True,
            can_edit_order=False,
            can_view_defect=True,
            can_edit_defect=False,
            mail_access=True,
        )

        token = Token.objects.create(user=user)
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

        response = client.get("/api/auth/all_users/")

        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == user.id
        assert data[0]["name"] == user.name