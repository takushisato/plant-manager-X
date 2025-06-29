import factory
from apps.attendance.models.paid_leave import PaidLeave
from tests.factory.user_factory import UserFactory


class PaidLeaveFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = PaidLeave

    user = factory.SubFactory(UserFactory)
    paid_leave_days = factory.Faker("pyint", min_value=0, max_value=30)
    note = factory.Faker("sentence")
