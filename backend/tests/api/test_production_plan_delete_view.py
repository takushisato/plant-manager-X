import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.production_plan_factory import ProductionPlanFactory
from tests.factory.production_plan_detail_factory import ProductionPlanDetailFactory

@pytest.mark.django_db
class TestProductionPlanDeleteView:
    """
    生産計画を論理削除するビューのテスト

    url: /api/production/plans/{id}/delete/
    method: DELETE
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_production_plan=True)
        return user

    @pytest.fixture
    def plan_with_details(self, authed_user):
        plan = ProductionPlanFactory(organization=authed_user.organization)
        ProductionPlanDetailFactory.create_batch(3, production_plan=plan)
        return plan

    def test_delete_success(self, client, authed_user, plan_with_details):
        """
        正常系: 生産計画を論理削除する

        条件:
        - 生産計画が存在する
        - 生産計画に詳細データが存在する

        結果:
        - ステータスコード 204
        - 生産計画と詳細データが論理削除される
        """
        client.force_authenticate(user=authed_user)
        response = client.delete(f"/api/production/plans/{plan_with_details.id}/delete/")
        assert response.status_code == status.HTTP_204_NO_CONTENT

        plan_with_details.refresh_from_db()
        assert plan_with_details.deleted_at is not None
        for detail in plan_with_details.details.all():
            assert detail.deleted_at is not None

    def test_delete_unauthenticated(self, client, plan_with_details):
        """
        異常系: 未認証

        条件:
        - 未認証

        結果:
        - ステータスコード 401
        - 生産計画と詳細データが論理削除されない
        """
        response = client.delete(f"/api/production/plans/{plan_with_details.id}/delete/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_without_permission(self, client, plan_with_details):
        """
        異常系: 編集権限がない

        条件:
        - check_prod_flow_edit_permission = False

        結果:
        - ステータスコード 403
        - 生産計画と詳細データが論理削除されない
        """
        user = UserFactory()
        PermissionFactory(user=user, can_edit_production_plan=False)
        client.force_authenticate(user=user)
        response = client.delete(f"/api/production/plans/{plan_with_details.id}/delete/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_delete_not_found(self, client, authed_user):
        """
        異常系: 生産計画が存在しない

        条件:
        - 生産計画が存在しない

        結果:
        - ステータスコード 404
        - 生産計画と詳細データが論理削除されない
        """
        client.force_authenticate(user=authed_user)
        response = client.delete("/api/production/plans/999999/delete/")
        assert response.status_code == status.HTTP_404_NOT_FOUND
