from django.db import models
from apps.utility.models import BaseModel
from apps.attendance.models.work_pattern import WorkPattern
from apps.staff_hub.models import User
from apps.utility.enums import WorkStatus


class AttendanceRecord(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="ユーザー")
    work_pattern = models.ForeignKey(WorkPattern, on_delete=models.CASCADE, verbose_name="勤務形態")
    work_date = models.DateField("勤務日")
    clock_in_time = models.TimeField("出勤時間")
    clock_out_time = models.TimeField("退勤時間")
    break_minutes = models.IntegerField("休憩時間(分)")
    work_minutes = models.IntegerField("勤務時間(分)")
    work_status = models.CharField(
        "勤務形態",
        max_length=20,
        choices=WorkStatus.choices,
        default=WorkStatus.PRESENT,
    )
    note = models.CharField("備考", max_length=1000, null=True, blank=True)

    class Meta:
        verbose_name = '勤怠'
        verbose_name_plural = '勤怠'
        db_table = 'attendance_records'

    def __str__(self):
        return f"{self.user.name} - {self.work_date} - {self.work_status}"