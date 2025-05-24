import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.utils.timezone import datetime
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.work_record_factory import WorkRecordFactory
from tests.factory.work_pattern_factory import WorkPatternFactory


@pytest.mark.django_db
class TestAttendanceRecordAllListGet:
    """
    全ての勤怠記録を取得するAPIのテスト

    URL: /api/attendance/records/all_list/
    Method: GET
    """

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
        return WorkRecordFactory.create_batch(3, user=admin_user, work_pattern=work_pattern, work_date=base_date.date())

    def test_successful_retrieval(self, client, admin_user, setup_records):
        """
        正常系: 全ての勤怠記録を取得できる

        条件:
        - 管理者ユーザー
        - 指定された月の勤怠記録が存在する

        結果:
        - 200ステータスコードが返される
        - ユーザーごとの勤務日数が正しい
        """
        client.force_authenticate(user=admin_user)
        response = client.get("/api/attendance/records/all_list/?month=2025-04")
        assert response.status_code == status.HTTP_200_OK

        # データ例:
        # [{'user': {'id': 1, 'name': 'John'}, 'total_worked_date': 3}]
        data = response.data
        assert len(data) == 1  # ユーザーごとのデータ
        assert data[0]["user"]["id"] == admin_user.id
        assert data[0]["total_worked_date"] == 3

    def test_missing_month_param(self, client, admin_user):
        """
        異常系: 月のパラメータが指定されていない場合、エラーが発生する

        条件:
        - 月のパラメータが指定されていない

        結果:
        - 400エラーが発生する
        - エラーメッセージが表示される
        """
        client.force_authenticate(user=admin_user)
        response = client.get("/api/attendance/records/all_list/")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "month パラメータは必須です。" in str(response.data)

    def test_invalid_month_format(self, client, admin_user):
        """
        異常系: 月のパラメータが無効な形式の場合、エラーが発生する

        条件:
        - 月のパラメータが無効な形式の場合

        結果:
        - 400エラーが発生する
        - エラーメッセージが表示される
        """
        client.force_authenticate(user=admin_user)
        response = client.get("/api/attendance/records/all_list/?month=2025/04")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "無効な月の形式です" in str(response.data)

    def test_forbidden_user(self, client, non_admin_user):
        """
        異常系: 非管理者ユーザーが全ての勤怠記録を取得しようとした場合、エラーが発生する

        条件:
        - 非管理者ユーザー

        結果:
        - 403エラーが発生する
        - エラーメッセージが表示される
        """
        client.force_authenticate(user=non_admin_user)
        response = client.get("/api/attendance/records/all_list/?month=2025-04")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_unauthenticated_user(self, client):
        """
        異常系: 認証されていないユーザーが全ての勤怠記録を取得しようとした場合、エラーが発生する

        条件:
        - 認証されていないユーザー

        結果:
        - 401エラーが発生する
        - エラーメッセージが表示される
        """
        response = client.get("/api/attendance/records/all_list/?month=2025-04")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
