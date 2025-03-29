import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.material_factory import MaterialFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestReceiveStockView:
    """
    資材受け入れビューのテスト

    url: /api/materials/{material_id}/receive_stock/
    method: PUT
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def material(self):
        return MaterialFactory(stock_qty=10)

    @pytest.fixture
    def user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, material_access=True)
        return user

    @pytest.fixture
    def user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, material_access=False)
        return user

    def test_receive_stock_success(self, client, user_with_permission, material):
        """
        正常系: 在庫を受け入れ成功
        
        条件:
        - 在庫数: 10
        - added_qty: 5
        - material_access=True

        結果:
        - ステータスコード 200
        """
        client.force_authenticate(user=user_with_permission)

        response = client.put(
            f"/api/materials/{material.id}/receive_stock/",
            data={"added_qty": 5},
            format="json"
        )

        material.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert material.stock_qty == 15
        assert response.data["current_stock"] == 15

    def test_receive_stock_forbidden(self, client, user_without_permission, material):
        """
        異常系: 権限がないと403

        条件:
        - 在庫数: 10
        - added_qty: 5
        - material_access=False

        結果:
        - ステータスコード 403
        """
        client.force_authenticate(user=user_without_permission)

        response = client.put(
            f"/api/materials/{material.id}/receive_stock/",
            data={"added_qty": 5},
            format="json"
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "権限" in str(response.data["detail"])

    def test_receive_stock_unauthenticated(self, client, material):
        """
        異常系: 未認証は401
        
        条件:
        - 在庫数: 10
        - added_qty: 5

        結果:
        - ステータスコード 401
        """
        response = client.put(
            f"/api/materials/{material.id}/receive_stock/",
            data={"added_qty": 5},
            format="json"
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    @pytest.mark.parametrize("invalid_qty", [0, -1, -100])
    def test_receive_stock_invalid_quantity(self, client, user_with_permission, material, invalid_qty):
        """
        異常系: 0以下の数は400
        
        条件:
        - 在庫数: 10
        - added_qty: 0以下の数

        結果:
        - ステータスコード 400
        """
        client.force_authenticate(user=user_with_permission)

        response = client.put(
            f"/api/materials/{material.id}/receive_stock/",
            data={"added_qty": invalid_qty},
            format="json"
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "受け入れ数" in str(response.data)
