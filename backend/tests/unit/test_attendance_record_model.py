import pytest
from datetime import date, time, timedelta
from apps.attendance.models.record import Record
from apps.utility.enums import WorkStatus
from tests.factory.record_factory import RecordFactory
from tests.factory.user_factory import UserFactory
from tests.factory.work_pattern_factory import WorkPatternFactory


@pytest.mark.django_db
def test_create_attendance_record_with_factory():
    """
    RecordFactory で正常に作成されることを確認
    """
    record = RecordFactory()
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
    record = Record.objects.create(
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


@pytest.mark.django_db
def test_get_records_by_month():
    """
    get_records_by_month が指定月の勤怠を正しく返すこと
    """
    # 2025年4月分のデータを2件作成
    RecordFactory(work_date=date(2025, 4, 1))
    RecordFactory(work_date=date(2025, 4, 15))

    # 範囲外のデータ（3月末、5月初）も作成
    RecordFactory(work_date=date(2025, 3, 31))
    RecordFactory(work_date=date(2025, 5, 1))

    results = Record.get_records_by_month(date(2025, 4, 1))
    assert results.count() == 2
    for record in results:
        assert record.work_date.month == 4


@pytest.mark.django_db
def test_get_records_by_user_and_month():
    """
    get_records_by_user_and_month が指定ユーザー・月の勤怠を返すこと
    """
    user1 = UserFactory()
    user2 = UserFactory()
    date_april = date(2025, 4, 1)
    start_date = date_april.replace(day=1)
    end_date = (start_date + timedelta(days=31)).replace(day=1)

    # user1 に4月の記録2件、user2 に1件
    RecordFactory(user=user1, work_date=date(2025, 4, 1))
    RecordFactory(user=user1, work_date=date(2025, 4, 20))
    RecordFactory(user=user2, work_date=date(2025, 4, 10))

    records = Record.get_records_by_user_and_month(user1, start_date, end_date)
    assert records.count() == 2
    for record in records:
        assert record.user == user1
        assert record.work_date >= start_date and record.work_date < end_date


@pytest.mark.django_db
def test_create_record():
    """
    create_record が指定した内容で正しく勤怠を作成すること
    """
    user = UserFactory()
    pattern = WorkPatternFactory()
    work_date_val = date(2025, 4, 1)
    clock_in = time(9, 0)
    clock_out = time(18, 0)
    break_min = 60
    work_min = 480
    status = WorkStatus.PRESENT
    note_val = "テスト勤務"

    record = Record.create_record(
        user=user,
        work_pattern=pattern,
        work_date=work_date_val,
        clock_in_time=clock_in,
        clock_out_time=clock_out,
        break_minutes=break_min,
        work_minutes=work_min,
        work_status=status,
        note=note_val
    )

    assert Record.objects.count() == 1
    assert record.user == user
    assert record.work_pattern == pattern
    assert record.work_date == work_date_val
    assert record.clock_in_time == clock_in
    assert record.clock_out_time == clock_out
    assert record.break_minutes == break_min
    assert record.work_minutes == work_min
    assert record.work_status == status
    assert record.note == note_val
