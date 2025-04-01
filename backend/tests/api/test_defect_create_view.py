import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.customer_factory import CustomerFactory
from tests.factory.order_factory import OrderFactory
from apps.bug_note.models.defect import Defect


@pytest.mark.django_db
class TestDefectCreateView:

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_defect=True)
        return user

    @pytest.fixture
    def order(self, authed_user):
        customer = CustomerFactory()
        return OrderFactory(customer=customer)

    def test_create_defect_success(self, client, authed_user, order):
        client.force_authenticate(user=authed_user)
        data = {
            "order": order.id,
            "occurred_at": "2025-04-01T10:00:00Z",
            "title": "不具合テスト",
            "defect_detail": "詳細説明",
            "submission": "対策内容",
            "submission_deadline": "2025-04-10T17:00:00Z"
        }

        response = client.post("/api/bug_note/defects/create/", data=data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["title"] == "不具合テスト"
        assert Defect.objects.count() == 1

    def test_unauthenticated_user_cannot_create(self, client, order):
        data = {
            "order": order.id,
            "occurred_at": "2025-04-01T10:00:00Z",
            "title": "未認証",
            "defect_detail": "詳細",
            "submission": "対策",
            "submission_deadline": "2025-04-10T17:00:00Z"
        }

        response = client.post("/api/bug_note/defects/create/", data=data, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_without_permission_cannot_create(self, client, order):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_defect=False)
        client.force_authenticate(user=user)

        data = {
            "order": order.id,
            "occurred_at": "2025-04-01T10:00:00Z",
            "title": "権限なし",
            "defect_detail": "詳細",
            "submission": "対策",
            "submission_deadline": "2025-04-10T17:00:00Z"
        }

        response = client.post("/api/bug_note/defects/create/", data=data, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_invalid_data(self, client, authed_user):
        client.force_authenticate(user=authed_user)
        response = client.post("/api/bug_note/defects/create/", data={}, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
