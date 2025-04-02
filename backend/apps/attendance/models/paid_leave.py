from django.db import models
from apps.utility.models import BaseModel
from apps.staff_hub.models import User

class PaidLeave(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="ユーザー")
    paid_leave_days = models.IntegerField("有給休暇日数", default=0)
    note = models.CharField("備考", max_length=1000, null=True, blank=True)
    
    class Meta:
        verbose_name = '有給休暇'
        verbose_name_plural = '有給休暇'
        db_table = 'paid_leaves'

    def __str__(self):
        return f"{self.user.name} - {self.paid_leave_days}"