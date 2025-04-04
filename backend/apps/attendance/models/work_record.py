from django.db import models
from apps.utility.models import BaseModel
from apps.attendance.models.work_pattern import WorkPattern
from apps.staff_hub.models import User
from apps.utility.enums import WorkStatus


class WorkRecord(BaseModel):
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
        db_table = 'work_records'

    def __str__(self):
        return f"{self.user.name} - {self.work_date} - {self.work_status}"
    
    @classmethod
    def get_records_by_month(cls, month):
        """
        全ユーザーの指定された月の勤怠記録を取得する
        """
        from apps.attendance.views.validations import get_month_range
        start_date, end_date = get_month_range(month)
        return cls.objects.filter(
            work_date__gte=start_date,
            work_date__lt=end_date,
            deleted_at__isnull=True
        ).select_related("user", "work_pattern")
    

    @classmethod
    def get_records_by_user_and_month(cls, user, start_date, end_date):
        """
        指定されたユーザーの月の勤怠記録を取得する
        """
        return cls.objects.filter(
            user=user,
            work_date__gte=start_date,
            work_date__lt=end_date,
            deleted_at__isnull=True
        ).select_related("user", "work_pattern")
    
    
    @classmethod
    def create_record(cls, user, work_pattern, work_date, clock_in_time, clock_out_time, break_minutes, work_minutes, work_status, note):
        """
        勤怠記録を作成する
        """
        attendance = WorkRecord.objects.create(
            user=user,
            work_pattern=work_pattern,
            work_date=work_date,
            clock_in_time=clock_in_time,
            clock_out_time=clock_out_time,
            break_minutes=break_minutes,
            work_minutes=work_minutes,
            work_status=work_status,
            note=note
        )
        return attendance
