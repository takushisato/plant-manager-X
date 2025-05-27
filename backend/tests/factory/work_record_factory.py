import factory
from datetime import date, time
from apps.attendance.models.work_record import WorkRecord
from apps.utility.enums import WorkStatus
from .user_factory import UserFactory
from .work_pattern_factory import WorkPatternFactory


class WorkRecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = WorkRecord

    user = factory.SubFactory(UserFactory)
    work_pattern = factory.SubFactory(WorkPatternFactory)
    date = factory.Faker("date_this_year")
    start_time = factory.LazyFunction(lambda: time(9, 0))
    end_time = factory.LazyFunction(lambda: time(18, 0))
    break_minutes = 60
    work_minutes = 480
    work_status = WorkStatus.PRESENT
    note = factory.Faker("sentence")
