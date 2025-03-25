import pytest
from datetime import time
from apps.attendance.models.work_pattern import WorkPattern
from tests.factory.work_pattern_factory import WorkPatternFactory


@pytest.mark.django_db
def test_create_work_pattern_with_factory():
    """
    WorkPatternFactory で正常に作成できることを確認
    """
    pattern = WorkPatternFactory()
    assert pattern.work_pattern_name
    assert isinstance(pattern.start_time, time)
    assert isinstance(pattern.end_time, time)
    assert isinstance(pattern.break_total_minute, int)


@pytest.mark.django_db
def test_work_pattern_default_break_time():
    """
    休憩時間（break_total_minute）のデフォルトが 0 であることを確認
    """
    pattern = WorkPattern.objects.create(
        work_pattern_name="朝勤",
        start_time=time(8, 0),
        end_time=time(17, 0)
    )
    assert pattern.break_total_minute == 0


@pytest.mark.django_db
def test_work_pattern_str_representation():
    """
    __str__ が work_pattern_name を返すように拡張した場合に備えたテスト
    """
    pattern = WorkPatternFactory(work_pattern_name="夜勤")
    assert str(pattern) == "夜勤"
