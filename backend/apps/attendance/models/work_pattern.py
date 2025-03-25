from django.db import models
from apps.utility.models import BaseModel


class WorkPattern(BaseModel):
    """
    勤務形態モデル
    """
    work_pattern_name = models.CharField("勤務形態名", max_length=255)
    start_time = models.TimeField("勤務開始時間")
    end_time = models.TimeField("勤務終了時間")
    break_total_minute = models.IntegerField("1日の休憩時間", default=0)
    note = models.CharField("備考", max_length=1000, null=True, blank=True)

    class Meta:
        verbose_name = '勤務形態'
        verbose_name_plural = '勤務形態'
        db_table = 'work_patterns'

    def __str__(self):
        return self.work_pattern_name


