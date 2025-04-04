import pytest
from rest_framework.test import APIClient
from rest_framework import status
from apps.trade_flow.models.orders import Order
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.customer_factory import CustomerFactory


@pytest.mark.django_db
class TestTradeOrderPost:
    """
    注文情報を新規作成するビューのテスト

    url: /api/trade/orders/
    method: POST
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
    def customer(self):
        return CustomerFactory()

    def test_create_order_success(self, client, authed_user, customer):
        """
        正常系: 注文情報を新規作成する

        条件:
        - ユーザーが認証されている
        - 顧客情報が存在する
        
        結果:
        - ステータスコード 201
        - 注文情報が作成される
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
        response = client.post("/api/trade/orders/", data=payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert Order.objects.count() == 1
        assert response.data["order_number"] == "ORD-001"

    def test_create_order_unauthorized(self, client, customer):
        """
        異常系: 未認証

        条件:
        - 未認証
        
        結果:
        - ステータスコード 401
        - 注文情報が作成されない
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
        response = client.post("/api/trade/orders/", data=payload, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_order_forbidden(self, client, customer):
        """
        異常系: 編集権限がない

        条件:
        - check_trade_flow_edit_permission = False

        結果:
        - ステータスコード 403
        - 注文情報が作成されない
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
        response = client.post("/api/trade/orders/", data=payload, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_order_invalid_data(self, client, authed_user, customer):
        """
        異常系: 不正なデータ

        条件:
        - データ構造が不正
        
        結果:
        - ステータスコード 400
        - 注文情報が作成されない
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
        response = client.post("/api/trade/orders/", data=payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
