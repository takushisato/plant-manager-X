import pytest
from rest_framework.test import APIClient
from rest_framework import status
from apps.prod_flow.models.production_plan import ProductionPlan
from apps.prod_flow.models.production_plan_record import ProductionPlanRecord
from tests.factory.organization_factory import OrganizationFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestProductionPlanWithRecordsPost:
    """
    生産計画と詳細を一括で作成するビューのテスト

    url: /api/production/plan_with_records/
    method: POST
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def organization(self):
        return OrganizationFactory()

    @pytest.fixture
    def user_with_permission(self, organization):
        user = UserFactory(organization=organization)
        PermissionFactory(user=user, can_edit_production_plan=True)
        return user

    @pytest.fixture
    def user_without_permission(self, organization):
        user = UserFactory(organization=organization)
        PermissionFactory(user=user, can_edit_production_plan=False)
        return user

    def test_create_plan_with_records_success(self, client, user_with_permission, organization):
        """
        正常系: 生産計画と詳細を一括で作成成功

        条件:
        - permission.can_edit_production_plan = True

        結果:
        - ステータスコード 201
        """
        client.force_authenticate(user=user_with_permission)

        payload = {
            "organization": organization.id,
            "plan_date": "2025-04-01",
            "note": "テスト計画",
            "records": [
                {
                    "title": "工程A",
                    "planned_start_date": "2025-04-01",
                    "planned_end_date": "2025-04-02",
                    "actual_start_date": "2025-04-01",
                    "actual_end_date": "2025-04-02",
                    "sort": 1,
                    "note": "メモA"
                },
                {
                    "title": "工程B",
                    "planned_start_date": "2025-04-03",
                    "planned_end_date": "2025-04-04",
                    "actual_start_date": None,
                    "actual_end_date": None,
                    "sort": 2,
                    "note": "メモB"
                }
            ]
        }

        response = client.post("/api/production/plan_with_records/", data=payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert ProductionPlan.objects.count() == 1
        assert ProductionPlanRecord.objects.count() == 2
        assert response.data["note"] == "テスト計画"

    def test_create_plan_without_permission(self, client, user_without_permission, organization):
        """
        異常系: 作成権限がない場合

        条件:
        - permission.can_edit_production_plan = False

        結果:
        - ステータスコード 403
        - 権限エラーメッセージを含む
        """
        client.force_authenticate(user=user_without_permission)

        payload = {
            "organization": organization.id,
            "plan_date": "2025-04-01",
            "note": "テスト計画",
            "records": []
        }

        response = client.post("/api/production/plan_with_records/", data=payload, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_create_plan_unauthenticated(self, client, organization):
        """
        異常系: 未認証の場合

        条件:
        - 未認証の場合

        結果:
        - ステータスコード 401
        """
        payload = {
            "organization": organization.id,
            "plan_date": "2025-04-01",
            "note": "テスト計画",
            "records": []
        }

        response = client.post("/api/production/plan_with_records/", data=payload, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
    
    def test_create_plan_with_missing_body(self, client, user_with_permission):
        """
        異常系: リクエストボディが空の場合

        条件:
        - リクエストボディなし

        結果:
        - ステータスコード 400
        """
        client.force_authenticate(user=user_with_permission)

        response = client.post("/api/production/plan_with_records/", data={}, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "organization" in response.data

    def test_create_plan_with_invalid_organization(self, client, user_with_permission):
        """
        異常系: organization ID が存在しない場合

        条件:
        - 存在しない organization ID

        結果:
        - ステータスコード 400
        - 権限エラーメッセージを含む
        """
        client.force_authenticate(user=user_with_permission)

        payload = {
            "organization": 99999,  # 存在しないID
            "plan_date": "2025-04-01",
            "note": "不正な組織ID",
            "records": []
        }

        response = client.post("/api/production/plan_with_records/", data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "organization" in response.data