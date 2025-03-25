import factory
from datetime import date
from apps.prod_flow.models.production_plan import ProductionPlan
from .organization_factory import OrganizationFactory


class ProductionPlanFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ProductionPlan

    organization = factory.SubFactory(OrganizationFactory)
    plan_date = factory.Faker("date_this_year")
    note = factory.Faker("sentence")
