import pytest
from rest_framework import status
from rest_framework.test import APIClient

from tests.factory.material_factory import MaterialFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestMaterialGet:
    """
    資材一覧取得APIのテスト

    url: /api/materials/
    method: GET
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, material_only=True)
        return user

    @pytest.fixture
    def user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user)
        return user

    def test_material_list_success(self, client, user_with_permission):
        """
        正常系: material_accessを持つユーザーが一覧取得可能

        条件:
        - material_accessを持つユーザー
        - 5つの資材を作成

        結果:
        - ステータスコード200
        - 資材一覧が返される
        """
        MaterialFactory.create_batch(5, organization=user_with_permission.organization)
        client.force_authenticate(user=user_with_permission)

        response = client.get("/api/materials/")

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) == 5

    def test_material_list_forbidden(self, client, user_without_permission):
        """
        異常系: material_accessがないユーザーは403

        条件:
        - material_accessがないユーザー

        結果:
        - ステータスコード403
        - 権限がない旨のメッセージが返される
        """
        client.force_authenticate(user=user_without_permission)

        response = client.get("/api/materials/")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "権限" in str(response.data)

    def test_material_list_unauthenticated(self, client):
        """
        異常系: 未ログインユーザーは401

        条件:
        - 未ログインユーザー

        結果:
        - ステータスコード401
        """
        response = client.get("/api/materials/")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
