import factory
from datetime import time
from apps.attendance.models.work_pattern import WorkPattern


class WorkPatternFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = WorkPattern

    work_pattern_name = factory.Faker("word")
    start_time = factory.LazyFunction(lambda: time(9, 0))  # 09:00
    end_time = factory.LazyFunction(lambda: time(18, 0))  # 18:00
    break_total_minute = 60
    note = factory.Faker("sentence")
