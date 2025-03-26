import factory
from datetime import time
from apps.attendance.models.break_setting import BreakSetting
from .work_pattern_factory import WorkPatternFactory


class BreakSettingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BreakSetting

    work_pattern = factory.SubFactory(WorkPatternFactory)
    start_time = factory.LazyFunction(lambda: time(12, 0))  # 12:00
    end_time = factory.LazyFunction(lambda: time(13, 0))    # 13:00
    note = factory.Faker("sentence")