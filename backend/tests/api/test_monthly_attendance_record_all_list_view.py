import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.utils.timezone import datetime
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.record_factory import RecordFactory
from tests.factory.work_pattern_factory import WorkPatternFactory


@pytest.mark.django_db
class TestMonthlyAttendanceRecordAllListView:

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def admin_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_manage_all_attendance=True)
        return user

    @pytest.fixture
    def non_admin_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_manage_all_attendance=False)
        return user

    @pytest.fixture
    def setup_records(self, admin_user):
        work_pattern = WorkPatternFactory()
        base_date = datetime(2025, 4, 1)
        return RecordFactory.create_batch(3, user=admin_user, work_pattern=work_pattern, work_date=base_date.date())

    def test_successful_retrieval(self, client, admin_user, setup_records):
        client.force_authenticate(user=admin_user)
        response = client.get("/api/attendance/records/all/list/?month=2025-04")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3

    def test_missing_month_param(self, client, admin_user):
        client.force_authenticate(user=admin_user)
        response = client.get("/api/attendance/records/all/list/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "month パラメータは必須です。" in str(response.data)

    def test_invalid_month_format(self, client, admin_user):
        client.force_authenticate(user=admin_user)
        response = client.get("/api/attendance/records/all/list/?month=2025/04")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "無効な月の形式です" in str(response.data)

    def test_forbidden_user(self, client, non_admin_user):
        client.force_authenticate(user=non_admin_user)
        response = client.get("/api/attendance/records/all/list/?month=2025-04")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_unauthenticated_user(self, client):
        response = client.get("/api/attendance/records/all/list/?month=2025-04")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
