import pytest
from rest_framework import status
from rest_framework.test import APIClient

from tests.factory.material_factory import MaterialFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestUseStockView:
    """
    資材使用量ビューのテスト

    url: /api/materials/{material_id}/use_stock/
    method: PUT
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def material(self):
        return MaterialFactory(stock_qty=10)

    @pytest.fixture
    def authed_user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, material_access=True)
        return user

    @pytest.fixture
    def authed_user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, material_access=False)
        return user

    def test_use_stock_success(self, client, authed_user_with_permission, material):
        """
        正常系: material_access 権限のあるユーザーが在庫を使用する場合

        条件:
        - 在庫数: 10
        - used_qty: 3
        - material_access=True

        結果:
        - ステータスコード 200
        - 在庫が 7 に減る
        - レスポンスに残り在庫が含まれる
        """
        client.force_authenticate(user=authed_user_with_permission)

        response = client.put(
            f"/api/materials/{material.id}/use_stock/",
            data={"used_qty": 3},
            format="json"
        )

        material.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert material.stock_qty == 7
        assert response.data["current_stock"] == 7

    def test_use_stock_forbidden_without_permission(self, client, authed_user_without_permission, material):
        """
        異常系: material_access 権限のないユーザーが在庫を使用しようとした場合

        条件:
        - material_access=False

        結果:
        - ステータスコード 403
        - 権限エラーメッセージを含む
        """
        client.force_authenticate(user=authed_user_without_permission)

        response = client.put(
            f"/api/materials/{material.id}/use_stock/",
            data={"used_qty": 1},
            format="json"
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "権限" in str(response.data["detail"])

    def test_use_stock_unauthorized(self, client, material):
        """
        異常系: 未認証ユーザーが在庫を使用しようとした場合

        結果:
        - ステータスコード 401 Unauthorized
        """
        response = client.put(
            f"/api/materials/{material.id}/use_stock/",
            data={"used_qty": 1},
            format="json"
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_use_stock_over_limit(self, client, authed_user_with_permission, material):
        """
        異常系: 使用数が在庫数を超えている場合

        条件:
        - stock_qty = 10
        - used_qty = 11

        結果:
        - ステータスコード 400 Bad Request
        - 在庫不足を示すエラーメッセージ
        """
        client.force_authenticate(user=authed_user_with_permission)

        response = client.put(
            f"/api/materials/{material.id}/use_stock/",
            data={"used_qty": material.stock_qty + 1},
            format="json"
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "在庫" in str(response.data)

    @pytest.mark.parametrize("invalid_qty", [0, -1, -100])
    def test_use_stock_invalid_quantity(self, client, authed_user_with_permission, material, invalid_qty):
        """
        異常系: used_qty が 0 以下の場合はエラー

        条件:
        - used_qty = 0, -1, -100

        結果:
        - ステータスコード 400 Bad Request
        - エラーメッセージに "1 以上" を含む
        """
        client.force_authenticate(user=authed_user_with_permission)

        response = client.put(
            f"/api/materials/{material.id}/use_stock/",
            data={"used_qty": invalid_qty},
            format="json"
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "1以上にしてください" in str(response.data)