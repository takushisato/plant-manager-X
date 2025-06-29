import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.customer_factory import CustomerFactory
from tests.factory.order_factory import OrderFactory
from tests.factory.defect_factory import DefectFactory
from apps.bug_note.models.defect import Defect


@pytest.mark.django_db
class TestDefectDetailPut:
    """
    不具合情報を編集するAPIのテスト

    URL: /api/bug_note/defects/<int:pk>/
    METHOD: PUT
    """

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

    @pytest.fixture
    def defect(self, order, authed_user):
        return DefectFactory(order=order, create_user=authed_user)

    def test_update_defect_success(self, client, authed_user, order, defect):
        """
        正常系: 不具合情報を編集する

        条件:
        - 不具合情報の編集

        結果:
        - ステータスコード200
        - 不具合情報が編集される
        """
        client.force_authenticate(user=authed_user)
        data = {
            "order": order.id,
            "occurred_at": "2025-04-01T10:00:00Z",
            "title": "不具合テスト",
            "defect_detail": "詳細説明",
            "submission": "対策内容",
            "submission_deadline": "2025-04-10T17:00:00Z",
        }

        response = client.put(
            f"/api/bug_note/defects/{defect.id}/", data=data, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["title"] == "不具合テスト"
        assert Defect.objects.count() == 1

    def test_unauthenticated_user_cannot_update(self, client, order, defect):
        """
        異常系: 認証されていないユーザーが編集できない

        条件:
        - 認証されていないユーザー

        結果:
        - ステータスコード401
        - 不具合情報が編集されない
        """
        data = {
            "order": order.id,
            "occurred_at": "2025-04-01T10:00:00Z",
            "title": "未認証",
            "defect_detail": "詳細",
            "submission": "対策",
            "submission_deadline": "2025-04-10T17:00:00Z",
        }

        response = client.put(
            f"/api/bug_note/defects/{defect.id}/", data=data, format="json"
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_without_permission_cannot_update(self, client, order, defect):
        """
        異常系: 権限がないユーザーが編集できない

        条件:
        - 権限がないユーザー

        結果:
        - ステータスコード403
        - 不具合情報が編集されない
        """
        user = UserFactory()
        PermissionFactory(user=user, can_edit_defect=False)
        client.force_authenticate(user=user)

        data = {
            "order": order.id,
            "occurred_at": "2025-04-01T10:00:00Z",
            "title": "権限なし",
            "defect_detail": "詳細",
            "submission": "対策",
            "submission_deadline": "2025-04-10T17:00:00Z",
        }

        response = client.put(
            f"/api/bug_note/defects/{defect.id}/", data=data, format="json"
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_invalid_data(self, client, authed_user, defect):
        """
        異常系: 不正なデータが送信された場合、エラーが返される

        条件:
        - リクエストボディが空

        結果:
        - ステータスコード400
        - 不具合情報が編集されない
        """
        client.force_authenticate(user=authed_user)
        response = client.put(
            f"/api/bug_note/defects/{defect.id}/", data={}, format="json"
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
