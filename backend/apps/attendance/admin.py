from django.contrib import admin
from .models.paid_leave import PaidLeave
from .models.break_setting import BreakSetting
from .models.work_pattern import WorkPattern
from .models.work_record import WorkRecord


admin.site.register(PaidLeave)
admin.site.register(BreakSetting)
admin.site.register(WorkPattern)
admin.site.register(WorkRecord)