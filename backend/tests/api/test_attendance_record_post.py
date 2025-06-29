import pytest
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, time
from apps.attendance.models.work_record import WorkRecord
from tests.factory.work_record_factory import WorkRecordFactory
from tests.factory.work_pattern_factory import WorkPatternFactory
from tests.factory.break_setting_factory import BreakSettingFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestAttendanceRecordPost:
    """
    勤怠記録作成APIのテスト

    URL: /api/attendance/records/
    Method: POST
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
        pattern = WorkPatternFactory(start_time=time(9, 0), end_time=time(18, 0))
        BreakSettingFactory(
            work_pattern=pattern, start_time=time(12, 0), end_time=time(13, 0)
        )
        return pattern

    def test_create_success(self, client, authed_user, work_pattern):
        """
        正常系: 勤怠記録を作成できる

        条件:
        - 勤務形態が有休でない
        - 出勤時間と退勤時間の順番が正しい
        - 勤務時間が勤務形態の勤務時間内である
        - 同じ勤務日に同じユーザーが勤怠記録を作成していない

        結果:
        - 勤怠記録が作成される
        - 勤怠記録の勤務時間が計算される
        - 勤怠記録の勤務時間が勤務形態の勤務時間内である
        """
        client.force_authenticate(user=authed_user)

        payload = {
            "work_pattern": work_pattern.id,
            "date": str(date.today()),
            "start_time": "09:00",
            "end_time": "18:00",
            "work_status": "present",
            "note": "勤務記録テスト",
        }

        response = client.post("/api/attendance/records/", data=payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert WorkRecord.objects.filter(user=authed_user, date=date.today()).exists()

    def test_duplicate_record_error(self, client, authed_user, work_pattern):
        """
        異常系: 同じ勤務日に同じユーザーが勤怠記録を作成している場合、エラーが発生する

        条件:
        - 同じ勤務日に同じユーザーが勤怠記録を作成している

        結果:
        - 400エラーが発生する
        - エラーメッセージが表示される
        """

        WorkRecordFactory(user=authed_user, date=date.today())

        client.force_authenticate(user=authed_user)

        payload = {
            "work_pattern": work_pattern.id,
            "date": str(date.today()),
            "start_time": "09:00",
            "end_time": "18:00",
            "work_status": "present",
        }

        response = client.post("/api/attendance/records/", data=payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "この勤務日はすでに記録されています。" in str(response.data)

    def test_invalid_time_order(self, client, authed_user, work_pattern):
        """
        異常系: 出勤時間と退勤時間の順番が正しくない場合、エラーが発生する

        条件:
        - 出勤時間と退勤時間の順番が正しくない

        結果:
        - 400エラーが発生する
        - エラーメッセージが表示される
        """

        client.force_authenticate(user=authed_user)

        payload = {
            "work_pattern": work_pattern.id,
            "date": str(date.today()),
            "start_time": "18:00",
            "end_time": "09:00",
            "work_status": "present",
        }

        response = client.post("/api/attendance/records/", data=payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "退勤時間は出勤時間より後である必要があります。" in str(response.data)

    def test_outside_work_pattern_error(self, client, authed_user, work_pattern):
        """
        異常系: 勤務時間が勤務形態の勤務時間外である場合、エラーが発生する

        条件:
        - 勤務時間が勤務形態の勤務時間外である

        結果:
        - 400エラーが発生する
        - エラーメッセージが表示される
        """

        client.force_authenticate(user=authed_user)

        payload = {
            "work_pattern": work_pattern.id,
            "date": str(date.today()),
            "start_time": "08:00",
            "end_time": "19:00",
            "work_status": "present",
        }

        response = client.post("/api/attendance/records/", data=payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "勤務時間が勤務形態の勤務時間外です。" in str(response.data)

    def test_unauthenticated_user(self, client, work_pattern):
        """
        異常系: 認証されていないユーザーが勤怠記録を作成しようとした場合、エラーが発生する

        条件:
        - 認証されていないユーザー

        結果:
        - 401エラーが発生する
        - エラーメッセージが表示される
        """

        payload = {
            "work_pattern": work_pattern.id,
            "date": str(date.today()),
            "start_time": "09:00",
            "end_time": "18:00",
            "work_status": "present",
        }

        response = client.post("/api/attendance/records/", data=payload, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
