import factory
from apps.trade_flow.models.customer import Customer


class CustomerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Customer

    customer_name = factory.Faker("company")
    telephone = factory.Faker("phone_number")
    fax = factory.Faker("phone_number")
    email = factory.Faker("email")
    postal_code = factory.Faker("postcode")
    address = factory.Faker("address")
    client_contact = factory.Faker("name")
    internal_contact = factory.Faker("name")
    note = factory.Faker("sentence")
