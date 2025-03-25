import factory
from datetime import datetime, timedelta
from apps.bug_note.models.defect import Defect
from tests.factory.user_factory import UserFactory
from tests.factory.order_factory import OrderFactory


class DefectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Defect

    create_user = factory.SubFactory(UserFactory)
    order = factory.SubFactory(OrderFactory)
    occurred_at = factory.LazyFunction(datetime.now)
    title = factory.Faker("sentence", nb_words=3)
    defect_detail = factory.Faker("paragraph", nb_sentences=2)
    submission = factory.Faker("paragraph", nb_sentences=1)
    submission_deadline = factory.LazyFunction(lambda: datetime.now() + timedelta(days=3))