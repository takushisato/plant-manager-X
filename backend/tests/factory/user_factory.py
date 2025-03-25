import factory
from apps.staff_hub.models import User
from .organization_factory import OrganizationFactory


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    name = factory.Faker("name")
    password = factory.PostGenerationMethodCall("set_password", "password123")
    organization = factory.SubFactory(OrganizationFactory)
    is_active = True
    is_staff = False
