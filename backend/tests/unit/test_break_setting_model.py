import pytest
from datetime import time
from apps.attendance.models.break_setting import BreakSetting
from tests.factory.break_setting_factory import BreakSettingFactory
from tests.factory.work_pattern_factory import WorkPatternFactory


@pytest.mark.django_db
def test_create_break_setting_with_factory():
    """
    BreakSettingFactory で正しくインスタンスを作成できる
    """
    break_setting = BreakSettingFactory()
    assert break_setting.work_pattern is not None
    assert isinstance(break_setting.start_time, time)
    assert isinstance(break_setting.end_time, time)


@pytest.mark.django_db
def test_break_setting_str_representation():
    """
    __str__ メソッドが '勤務形態名 - 開始時刻 - 終了時刻' を返す
    """
    work_pattern = WorkPatternFactory(work_pattern_name="日勤")
    break_setting = BreakSetting.objects.create(
        work_pattern=work_pattern,
        start_time=time(10, 0),
        end_time=time(10, 15),
    )
    assert str(break_setting) == "日勤 - 10:00:00 - 10:15:00"


@pytest.mark.django_db
def test_break_setting_default_note_is_blank():
    """
    note が省略可能であることを確認（null=True, blank=True）
    """
    break_setting = BreakSettingFactory(note=None)
    assert break_setting.note is None or isinstance(break_setting.note, str)
