import factory
from apps.staff_hub.models.organization import Organization


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Organization

    organization_name = factory.Faker("company")
    description = factory.Faker("catch_phrase")
