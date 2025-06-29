import pytest
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.production_plan_factory import ProductionPlanFactory
from tests.factory.production_plan_record_factory import ProductionPlanRecordFactory


@pytest.mark.django_db
class TestProductionPlanWithRecordDetailPut:
    """
    生産計画を更新するビューのテスト

    url: /api/production/plan_with_records/{id}/
    method: PUT
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
    def plan(self, authed_user):
        return ProductionPlanFactory(organization=authed_user.organization)

    @pytest.fixture
    def records(self, plan):
        return ProductionPlanRecordFactory.create_batch(2, production_plan=plan)

    def test_update_success(self, client, authed_user, plan, records):
        """
        正常系: 生産計画を更新する

        条件:
        - 生産計画が存在する
        - 生産計画に詳細データが存在する

        結果:
        - ステータスコード 200
        - 生産計画が更新される
        - 生産計画の詳細データが更新される
        """
        client.force_authenticate(user=authed_user)

        payload = {
            "organization": authed_user.organization.id,
            "plan_date": "2025-04-10",
            "note": "更新メモ",
            "records": [
                {
                    "id": records[0].id,
                    "title": "更新タイトル",
                    "planned_start_date": "2025-04-11",
                    "planned_end_date": "2025-04-12",
                    "actual_start_date": "2025-04-11",
                    "actual_end_date": "2025-04-12",
                    "sort": 1,
                    "note": "更新済みノート",
                },
                {
                    "title": "新しい詳細",
                    "planned_start_date": "2025-04-13",
                    "planned_end_date": "2025-04-14",
                    "actual_start_date": None,
                    "actual_end_date": None,
                    "sort": 2,
                    "note": "追加ノート",
                },
            ],
        }

        response = client.put(
            f"/api/production/plan_with_records/{plan.id}/", data=payload, format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["note"] == "更新メモ"
        assert len(response.data["records"]) == 2

    def test_unauthenticated_user_cannot_update(self, client, plan):
        """
        異常系: 未認証

        条件:
        - 未認証

        結果:
        - ステータスコード 401
        - 生産計画が更新されない
        """
        response = client.put(
            f"/api/production/plan_with_records/{plan.id}/", data={}, format="json"
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_without_permission_cannot_update(self, client, plan):
        """
        異常系: 編集権限がない

        条件:
        - 編集権限がない

        結果:
        - ステータスコード 403
        - 生産計画が更新されない
        """
        user = UserFactory()
        PermissionFactory(user=user, can_edit_production_plan=False)
        client.force_authenticate(user=user)

        response = client.put(
            f"/api/production/plan_with_records/{plan.id}/", data={}, format="json"
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_invalid_data(self, client, authed_user, plan):
        """
        異常系: 不正なデータ

        条件:
        - 不正なデータ

        結果:
        - ステータスコード 400
        - 生産計画が更新されない
        """
        client.force_authenticate(user=authed_user)
        invalid_data = {"plan_date": "", "records": []}  # 不正な日付

        response = client.put(
            f"/api/production/plan_with_records/{plan.id}/",
            data=invalid_data,
            format="json",
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    @pytest.mark.django_db
    def test_cannot_update_deleted_plan(self, client, authed_user, plan):
        """
        異常系: 論理削除された生産計画は更新できない

        条件:
        - 生産計画が論理削除されている

        結果:
        - ステータスコード 404
        - 更新されない
        """
        client.force_authenticate(user=authed_user)
        plan.deleted_at = timezone.now()
        plan.save()

        payload = {
            "organization": authed_user.organization.id,
            "plan_date": "2025-04-10",
            "note": "論理削除されているので更新されないはず",
            "records": [],
        }

        response = client.put(
            f"/api/production/plan_with_records/{plan.id}/", data=payload, format="json"
        )

        assert response.status_code == status.HTTP_404_NOT_FOUND
