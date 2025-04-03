import pytest
from rest_framework import status
from rest_framework.test import APIClient
from datetime import datetime

from tests.factory.order_factory import OrderFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestOrderDeleteView:
    """
    注文削除APIのテスト

    url: /api/trade/orders/{id}/
    method: DELETE
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_order=True)
        return user

    @pytest.fixture
    def authed_user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_order=False)
        return user

    @pytest.fixture
    def order(self):
        return OrderFactory()

    def test_delete_success(self, client, authed_user_with_permission, order):
        """
        正常系: 権限ありユーザーが論理削除できる

        条件:
        - 権限ありユーザー
        - 有効な注文

        結果:
        - ステータスコード204
        - 注文が論理削除される
        """
        client.force_authenticate(user=authed_user_with_permission)

        response = client.delete(f"/api/trade/orders/{order.id}/")

        order.refresh_from_db()

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert order.deleted_at is not None

    def test_delete_unauthorized(self, client, order):
        """
        異常系: 未認証ユーザーは削除不可

        条件:
        - 未認証ユーザー
        - 有効な注文

        結果:
        - ステータスコード401
        - 注文が論理削除されない
        """
        response = client.delete(f"/api/trade/orders/{order.id}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_forbidden(self, client, authed_user_without_permission, order):
        """
        異常系: 権限なしユーザーは削除不可

        条件:
        - 権限なしユーザー
        - 有効な注文

        結果:
        - ステータスコード403
        - 注文が論理削除されない
        """
        client.force_authenticate(user=authed_user_without_permission)

        response = client.delete(f"/api/trade/orders/{order.id}/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_already_deleted(self, client, authed_user_with_permission, order):
        """
        異常系: 既に削除された注文を削除しようとした場合

        条件:
        - 権限ありユーザー
        - 既に削除された注文

        結果:
        - ステータスコード404
        - 注文が論理削除されない
        """
        order.deleted_at = datetime.now()
        order.save()

        client.force_authenticate(user=authed_user_with_permission)

        response = client.delete(f"/api/trade/orders/{order.id}/")
        assert response.status_code == status.HTTP_404_NOT_FOUND
