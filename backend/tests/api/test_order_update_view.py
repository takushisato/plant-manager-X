import pytest
from rest_framework.test import APIClient
from rest_framework import status
from apps.trade_flow.models.orders import Order
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.customer_factory import CustomerFactory
from tests.factory.order_factory import OrderFactory


@pytest.mark.django_db
class TestOrderUpdateView:
    """
    注文情報を更新するビューのテスト

    url: /api/trade/orders/<int:pk>/update/
    method: PUT
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_order=True)
        return user

    @pytest.fixture
    def order(self, customer):
        return OrderFactory(customer=customer)

    @pytest.fixture
    def customer(self):
        return CustomerFactory()

    def test_update_order_success(self, client, authed_user, customer, order):
        """
        正常系: 注文情報を更新する

        条件:
        - ユーザーが認証されている
        - 顧客情報が存在する
        
        結果:
        - ステータスコード 200
        - 注文情報が更新される
        """
        client.force_authenticate(user=authed_user)
        payload = {
            "customer": customer.id,
            "order_number": "ORD-001",
            "order_date": "2025-04-01",
            "product_name": "サンプル商品",
            "quantity": 10,
            "price": 5000,
            "deadline": "2025-04-30",
            "note": "特記事項なし"
        }
        response = client.put(f"/api/trade/orders/{order.id}/update/", data=payload, format="json")
        assert response.status_code == status.HTTP_200_OK
        assert Order.objects.count() == 1
        assert response.data["order_number"] == "ORD-001"

    def test_update_order_unauthorized(self, client, customer, order):
        """
        異常系: 未認証

        条件:
        - 未認証
        
        結果:
        - ステータスコード 401
        - 注文情報が更新されない
        """
        payload = {
            "customer": customer.id,
            "order_number": "ORD-002",
            "order_date": "2025-04-01",
            "product_name": "商品",
            "quantity": 5,
            "price": 3000,
            "deadline": "2025-04-20",
        }
        response = client.put(f"/api/trade/orders/{order.id}/update/", data=payload, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_order_forbidden(self, client, customer, order):
        """
        異常系: 編集権限がない

        条件:
        - check_trade_flow_edit_permission = False

        結果:
        - ステータスコード 403
        - 注文情報が更新されない
        """
        user = UserFactory()
        PermissionFactory(user=user, can_edit_order=False)
        client.force_authenticate(user=user)
        payload = {
            "customer": customer.id,
            "order_number": "ORD-003",
            "order_date": "2025-04-01",
            "product_name": "商品",
            "quantity": 3,
            "price": 1500,
            "deadline": "2025-04-15",
        }
        response = client.put(f"/api/trade/orders/{order.id}/update/", data=payload, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_update_order_invalid_data(self, client, authed_user, customer, order):
        """
        異常系: 不正なデータ

        条件:
        - データ構造が不正
        
        結果:
        - ステータスコード 400
        - 注文情報が更新されない
        """
        client.force_authenticate(user=authed_user)
        payload = {
            "customer": customer.id,
            "order_number": "",
            "order_date": "invalid-date",
            "product_name": "",
            "quantity": -1,
            "price": "free",
            "deadline": "not-a-date",
        }
        response = client.put(f"/api/trade/orders/{order.id}/update/", data=payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
