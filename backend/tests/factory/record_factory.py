import factory
from datetime import date, time
from apps.attendance.models.record import Record
from apps.utility.enums import WorkStatus
from .user_factory import UserFactory
from .work_pattern_factory import WorkPatternFactory


class RecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Record

    user = factory.SubFactory(UserFactory)
    work_pattern = factory.SubFactory(WorkPatternFactory)
    work_date = factory.Faker("date_this_year")
    clock_in_time = factory.LazyFunction(lambda: time(9, 0))
    clock_out_time = factory.LazyFunction(lambda: time(18, 0))
    break_minutes = 60
    work_minutes = 480
    work_status = WorkStatus.PRESENT
    note = factory.Faker("sentence")
