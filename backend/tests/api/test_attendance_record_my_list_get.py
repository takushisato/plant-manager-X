import pytest
from rest_framework.test import APIClient
from rest_framework import status
from datetime import time, date
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.work_pattern_factory import WorkPatternFactory
from tests.factory.work_record_factory import WorkRecordFactory


@pytest.mark.django_db
class TestAttendanceRecordMyListGet:
    """
    月次勤怠記録一覧APIのテスト

    URL: /api/attendance/records/my_list/
    Method: GET
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_manage_own_attendance=True)
        return user

    @pytest.fixture
    def work_pattern(self):
        return WorkPatternFactory(start_time=time(9, 0), end_time=time(18, 0))

    @pytest.fixture
    def records_for_april(self, authed_user, work_pattern):
        return WorkRecordFactory.create_batch(
            3, user=authed_user, work_pattern=work_pattern, date=date(2025, 4, 10)
        )

    def test_list_attendance_by_month_success(
        self, client, authed_user, records_for_april
    ):
        """
        正常系: 指定された月の勤怠記録を取得できる

        条件:
        - 指定された月の勤怠記録が存在する

        結果:
        - 指定された月の勤怠記録が取得できる
        - 勤怠記録の数が正しい
        - 勤怠記録の勤務日が正しい
        - 200ステータスコードが返される
        """
        client.force_authenticate(user=authed_user)
        response = client.get("/api/attendance/records/my_list/?month=2025-04")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 3
        assert all(r["date"].startswith("2025-04") for r in response.data)

    def test_missing_month_param(self, client, authed_user):
        """
        異常系: 月のパラメータが指定されていない場合、エラーが発生する

        条件:
        - 月のパラメータが指定されていない

        結果:
        - 400エラーが発生する
        - エラーメッセージが表示される
        """

        client.force_authenticate(user=authed_user)
        response = client.get("/api/attendance/records/my_list/")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "month" in response.data["detail"]

    def test_invalid_month_format(self, client, authed_user):
        """
        異常系: 月のパラメータが無効な形式の場合、エラーが発生する

        条件:
        - 月のパラメータが無効な形式の場合

        結果:
        - 400エラーが発生する
        - エラーメッセージが表示される
        """

        client.force_authenticate(user=authed_user)
        response = client.get("/api/attendance/records/my_list/?month=invalid")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "無効な月の形式" in response.data["detail"]

    def test_unauthenticated_user(self, client):
        """
        異常系: 認証されていないユーザーが勤怠記録を取得しようとした場合、エラーが発生する

        条件:
        - 認証されていないユーザー

        結果:
        - 401エラーが発生する
        - エラーメッセージが表示される
        """

        response = client.get("/api/attendance/records/my_list/?month=2025-04")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_no_records_found(self, client, authed_user):
        """
        異常系: 指定された月の勤怠記録が存在しない場合、空のリストが返される

        条件:
        - 指定された月の勤怠記録が存在しない

        結果:
        - 空のリストが返される
        """

        client.force_authenticate(user=authed_user)
        response = client.get("/api/attendance/records/my_list/?month=2025-03")
        assert response.status_code == status.HTTP_200_OK
        assert response.data == []
