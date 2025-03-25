import pytest
from datetime import date, time
from apps.attendance.models.attendance_record import AttendanceRecord
from apps.utility.enums import WorkStatus
from tests.factory.attendance_record_factory import AttendanceRecordFactory
from tests.factory.user_factory import UserFactory
from tests.factory.work_pattern_factory import WorkPatternFactory


@pytest.mark.django_db
def test_create_attendance_record_with_factory():
    """
    AttendanceRecordFactory で正常に作成されることを確認
    """
    record = AttendanceRecordFactory()
    assert record.user is not None
    assert record.work_pattern is not None
    assert isinstance(record.work_date, date)
    assert isinstance(record.clock_in_time, time)
    assert isinstance(record.clock_out_time, time)
    assert isinstance(record.break_minutes, int)
    assert isinstance(record.work_minutes, int)
    assert record.work_status in WorkStatus.values


@pytest.mark.django_db
def test_attendance_record_str_method():
    """
    __str__ メソッドが「ユーザー名 - 勤務日 - 勤務状態」を返すこと
    """
    user = UserFactory(name="佐藤一郎")
    pattern = WorkPatternFactory(work_pattern_name="日勤")
    record = AttendanceRecord.objects.create(
        user=user,
        work_pattern=pattern,
        work_date=date(2025, 4, 1),
        clock_in_time=time(9, 0),
        clock_out_time=time(18, 0),
        break_minutes=60,
        work_minutes=480,
        work_status=WorkStatus.ABSENT
    )
    assert str(record) == "佐藤一郎 - 2025-04-01 - absent"
