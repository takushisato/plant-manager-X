from django.db import models

class WorkStatus(models.TextChoices):
    PRESENT = "present", "出勤"
    ABSENT = "absent", "欠勤"
    PAID_LEAVE = "paid_leave", "有休"
    LATE = "late", "遅刻"
    EARLY_LEAVE = "early_leave", "早退"
    HOLIDAY_WORK = "holiday_work", "休日出勤"
    SUBSTITUTE_HOLIDAY = "substitute_holiday", "代休"
