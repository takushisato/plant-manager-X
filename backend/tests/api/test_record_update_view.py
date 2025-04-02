import pytest
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date, time
from apps.attendance.models.record import Record
from tests.factory.record_factory import RecordFactory
from tests.factory.work_pattern_factory import WorkPatternFactory
from tests.factory.break_setting_factory import BreakSettingFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory

@pytest.mark.django_db
class TestRecordUpdateView:
    """
    勤怠記録更新APIのテスト

    URL: /api/attendance/records/{record.id}/update/
    Method: PUT
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
    def record(self, authed_user):
        work_pattern = WorkPatternFactory(start_time=time(9, 0), end_time=time(18, 0))
        return RecordFactory(
            user=authed_user,
            work_pattern=work_pattern,
            clock_in_time=time(9, 0),
            clock_out_time=time(17, 0),
            work_date=date(2025, 4, 5)
        )

    def test_update_success(self, client, authed_user, record):
        """
        正常系: 勤怠記録を更新できる

        条件:
        - 出勤時間と退勤時間の順番が正しい
        - 勤務時間が勤務形態の勤務時間内である
        - 同じ勤務日に同じユーザーが勤怠記録を作成していない

        結果:
        - 勤怠記録が更新される
        - 勤怠記録の勤務時間が更新される
        - 勤怠記録のノートが更新される
        - ステータスコードが200
        """
        client.force_authenticate(user=authed_user)
        payload = {
            "clock_out_time": "17:30",
            "note": "退勤時間修正"
        }

        response = client.put(f"/api/attendance/records/{record.id}/update/", data=payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert response.data["note"] == "退勤時間修正"
        assert response.data["clock_out_time"] == "17:30:00"

    def test_invalid_time_order(self, client, authed_user, record):
        """
        異常系: 出勤時間と退勤時間の順番が正しくない

        条件:
        - 出勤時間と退勤時間の順番が正しくない

        結果:
        - ステータスコードが400
        - エラーメッセージが"退勤時間は出勤時間より後である必要があります。"
        """
        client.force_authenticate(user=authed_user)
        payload = {
            "clock_in_time": "17:00",
            "clock_out_time": "09:00"
        }

        response = client.put(f"/api/attendance/records/{record.id}/update/", data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "退勤時間は出勤時間より後である必要があります。" in str(response.data)

    def test_outside_work_pattern(self, client, authed_user, record):
        """
        異常系: 勤務時間が勤務形態の勤務時間外である

        条件:
        - 勤務時間が勤務形態の勤務時間外である

        結果:
        - ステータスコードが400
        - エラーメッセージが"勤務時間が勤務形態の勤務時間外です。"
        """
        client.force_authenticate(user=authed_user)
        payload = {
            "clock_in_time": "08:00",
            "clock_out_time": "18:30"
        }

        response = client.put(f"/api/attendance/records/{record.id}/update/", data=payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "勤務時間が勤務形態の勤務時間外です。" in str(response.data)

    def test_forbidden_user(self, client, record):
        """
        異常系: 他人の勤怠記録を編集しようとする

        条件:
        - 他人の勤怠記録を編集しようとする

        結果:
        - ステータスコードが403
        - エラーメッセージが"認証は確認しましたが権限がありません。"
        """
        another_user = UserFactory()
        PermissionFactory(user=another_user, can_manage_own_attendance=False)
        client.force_authenticate(user=another_user)

        payload = {
            "note": "他人の勤怠を編集しようとする"
        }

        response = client.put(f"/api/attendance/records/{record.id}/update/", data=payload, format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert "認証は確認しましたが権限がありません。" in str(response.data)

    def test_unauthenticated_user(self, client, record):
        """
        異常系: ログインしていない

        条件:
        - ログインしていない

        結果:
        - ステータスコードが401
        - エラーメッセージが"認証が必要です。"
        """
        payload = {"note": "ログインしていない"}
        response = client.put(f"/api/attendance/records/{record.id}/update/", data=payload, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
