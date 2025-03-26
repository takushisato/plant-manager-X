from django.db import models
from apps.utility.models import BaseModel
from apps.attendance.models.work_pattern import WorkPattern


class BreakSetting(BaseModel):
    """
    休憩時間設定モデル
    """
    work_pattern = models.ForeignKey(WorkPattern, on_delete=models.CASCADE, verbose_name="勤務形態")
    start_time = models.TimeField("休憩開始時間")
    end_time = models.TimeField("休憩終了時間")
    note = models.CharField("備考", max_length=1000, null=True, blank=True)

    class Meta:
        verbose_name = '休憩時間設定'
        verbose_name_plural = '休憩時間設定'
        db_table = 'break_settings'

    def __str__(self):
        return f"{self.work_pattern.work_pattern_name} - {self.start_time} - {self.end_time}"


