import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.trade_flow.models.customer import Customer
from tests.factory.customer_factory import CustomerFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestCustomerListGet:
    """
    顧客一覧を取得するAPIのテスト

    URL: /api/trade/customers/
    METHOD: GET
    """

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_order=True)
        return user

    @pytest.fixture
    def auth_client(self, api_client, user_with_permission):
        api_client.force_authenticate(user=user_with_permission)
        return api_client

    @pytest.fixture
    def customers(self):
        return CustomerFactory.create_batch(3)

    def test_get_customer_list(self, auth_client, customers):
        """
        正常系: 顧客一覧を取得できる

        条件:
        - 認証済みユーザー
        - 顧客一覧が存在する

        結果:
        - ステータスコード200
        - 顧客一覧が取得できる
        """
        response = auth_client.get("/api/trade/customers/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data[0]["id"] == customers[0].id
