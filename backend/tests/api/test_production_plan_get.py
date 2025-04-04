import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.production_plan_factory import ProductionPlanFactory
from tests.factory.production_plan_record_factory import ProductionPlanRecordFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestPlanGet:
    """
    生産計画一覧を取得するビューのテスト

    url: /api/production/plans/
    method: GET
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_production_plan=True)
        return user

    @pytest.fixture
    def authed_user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_production_plan=False)
        return user

    @pytest.fixture
    def plans_with_records(self, authed_user_with_permission):
        plans = ProductionPlanFactory.create_batch(2, organization=authed_user_with_permission.organization)
        for plan in plans:
            ProductionPlanRecordFactory.create_batch(3, production_plan=plan)
        return plans

    def test_get_plans_with_permission(self, client, authed_user_with_permission, plans_with_records):
        """
        正常系: 生産計画一覧を取得成功

        条件:
        - permission.can_view_production_plan = True

        結果:
        - ステータスコード 200
        - 生産計画一覧を取得成功
        """
        client.force_authenticate(user=authed_user_with_permission)
        response = client.get("/api/production/plans/")
        assert response.status_code == status.HTTP_200_OK
        assert isinstance(response.data, list)
        assert len(response.data) == 2
        for plan in response.data:
            assert "records" in plan
            assert len(plan["records"]) == 3

    def test_get_plans_without_permission(self, client, authed_user_without_permission):
        """
        異常系: 閲覧権限がない

        条件:
        - permission.can_view_production_plan = False

        結果:
        - ステータスコード 403
        - 権限エラーメッセージを含む
        """
        client.force_authenticate(user=authed_user_without_permission)
        response = client.get("/api/production/plans/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_plans_unauthenticated(self, client):
        """
        異常系: 未認証

        条件:
        - 未認証

        結果:
        - ステータスコード 401
        - 生産計画一覧を取得失敗
        """
        response = client.get("/api/production/plans/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
