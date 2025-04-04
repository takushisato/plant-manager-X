import factory
from datetime import date, timedelta
from apps.prod_flow.models.production_plan_record import ProductionPlanRecord
from .production_plan_factory import ProductionPlanFactory


class ProductionPlanRecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProductionPlanRecord

    production_plan = factory.SubFactory(ProductionPlanFactory)
    title = factory.Faker("word")
    planned_start_date = factory.LazyFunction(lambda: date.today())
    planned_end_date = factory.LazyFunction(lambda: date.today() + timedelta(days=3))
    actual_start_date = factory.LazyFunction(lambda: date.today() + timedelta(days=1))
    actual_end_date = factory.LazyFunction(lambda: date.today() + timedelta(days=4))
    sort = factory.Sequence(lambda n: n)
    note = factory.Faker("sentence")
