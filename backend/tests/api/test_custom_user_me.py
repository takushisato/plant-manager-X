import pytest
from rest_framework.test import APIClient
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from rest_framework.authtoken.models import Token

@pytest.mark.django_db
class TestCustomUserMeView:
    """
    ユーザー情報取得APIのテスト

    URL: /api/auth/custom/users/me/
    Method: GET
    """

    def test_custom_user_me_view_with_permission(self):
        """
        正常系: ユーザーが権限を持っている場合のテスト

        条件:
        - ユーザーが権限を持っている

        結果:
        - ユーザー情報が取得できる
        - ユーザーの権限が取得できる
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
            master_data_access=False
        )

        # トークンを生成
        token = Token.objects.create(user=user)

        client = APIClient()
        # トークンベースの認証を使用
        client.credentials(HTTP_AUTHORIZATION=f'Token {token.key}')

        response = client.get("/api/auth/custom/users/me/")

        assert response.status_code == 200
        data = response.json()

        assert data["email"] == "user18@example.com"
        assert "permission" in data
        assert data["permission"]["material_access"] is False

    def test_custom_user_me_view_unauthenticated(self):
        """
        異常系: 認証されていない場合のテスト

        条件:
        - 認証されていない

        結果:
        - 401エラーが返される
        """
        client = APIClient()
        response = client.get("/api/auth/custom/users/me/")
        assert response.status_code == 401
