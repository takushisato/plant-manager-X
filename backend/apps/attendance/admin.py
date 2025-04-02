from django.contrib import admin
from .models.paid_leave import PaidLeave
from .models.break_setting import BreakSetting
from .models.work_pattern import WorkPattern
from .models.record import Record


admin.site.register(PaidLeave)
admin.site.register(BreakSetting)
admin.site.register(WorkPattern)
admin.site.register(Record)