import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.production_plan_factory import ProductionPlanFactory
from tests.factory.production_plan_detail_factory import ProductionPlanDetailFactory

@pytest.mark.django_db
class TestProductionPlanUpdateView:

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_production_plan=True)
        return user

    @pytest.fixture
    def plan(self, authed_user):
        return ProductionPlanFactory(organization=authed_user.organization)

    @pytest.fixture
    def details(self, plan):
        return ProductionPlanDetailFactory.create_batch(2, production_plan=plan)

    def test_update_success(self, client, authed_user, plan, details):
        client.force_authenticate(user=authed_user)

        payload = {
            "organization": authed_user.organization.id,
            "plan_date": "2025-04-10",
            "note": "更新メモ",
            "details": [
                {
                    "id": details[0].id,
                    "title": "更新タイトル",
                    "planned_start_date": "2025-04-11",
                    "planned_end_date": "2025-04-12",
                    "actual_start_date": "2025-04-11",
                    "actual_end_date": "2025-04-12",
                    "sort": 1,
                    "note": "更新済みノート"
                },
                {
                    "title": "新しい詳細",
                    "planned_start_date": "2025-04-13",
                    "planned_end_date": "2025-04-14",
                    "actual_start_date": None,
                    "actual_end_date": None,
                    "sort": 2,
                    "note": "追加ノート"
                }
            ]
        }

        response = client.put(f"/api/production/plans/{plan.id}/update/", data=payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["note"] == "更新メモ"
        assert len(response.data["details"]) == 2

    def test_unauthenticated_user_cannot_update(self, client, plan):
        response = client.put(f"/api/production/plans/{plan.id}/update/", data={}, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_without_permission_cannot_update(self, client, plan):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_production_plan=False)
        client.force_authenticate(user=user)

        response = client.put(f"/api/production/plans/{plan.id}/update/", data={}, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_invalid_data(self, client, authed_user, plan):
        client.force_authenticate(user=authed_user)
        invalid_data = {
            "plan_date": "",  # 不正な日付
            "details": []
        }

        response = client.put(f"/api/production/plans/{plan.id}/update/", data=invalid_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
