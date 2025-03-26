import factory
from apps.material.models.material import Material
from .organization_factory import OrganizationFactory

class MaterialFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Material

    organization = factory.SubFactory(OrganizationFactory)
    material_name = factory.Faker("word")
    material_price = factory.Faker("pyfloat", left_digits=3, right_digits=2, positive=True)
    stock_qty = factory.Faker("pyint", min_value=0, max_value=100)
    order_suggestion_qty = factory.Faker("pyint", min_value=0, max_value=50)
