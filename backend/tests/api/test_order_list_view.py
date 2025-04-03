import pytest
from rest_framework import status
from rest_framework.test import APIClient
from tests.factory.customer_factory import CustomerFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.order_factory import OrderFactory


@pytest.mark.django_db
class TestOrderListView:
    """
    注文一覧を取得するビューのテスト

    url: /api/trade/orders/
    method: GET
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_order=True)
        return user

    @pytest.fixture
    def user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_order=False)
        return user

    @pytest.fixture
    def orders(self, authed_user):
        customer = CustomerFactory()
        return OrderFactory.create_batch(3, customer=customer)

    def test_order_list_success(self, client, authed_user, orders):
        """
        正常系: 注文一覧を取得できる

        条件:
        - 認証済みユーザー
        - 閲覧権限がある

        結果:
        - ステータスコード 200
        - 注文一覧が取得できる
        """
        client.force_authenticate(user=authed_user)

        response = client.get("/api/trade/orders/")

        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) == 3
        for item in response.data:
            assert "order_number" in item
            assert "customer_name" in item

    def test_order_list_unauthenticated(self, client):
        """
        異常系: 未認証ユーザーは401

        条件:
        - 未認証ユーザー

        結果:
        - ステータスコード 401
        - 注文一覧が取得できない
        """
        response = client.get("/api/trade/orders/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_order_list_forbidden(self, client, user_without_permission):
        """
        異常系: 権限がないユーザーは403

        条件:
        - 閲覧権限がない

        結果:
        - ステータスコード 403
        """
        client.force_authenticate(user=user_without_permission)
        response = client.get("/api/trade/orders/")
        assert response.status_code == status.HTTP_403_FORBIDDEN
