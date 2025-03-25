import factory
from datetime import date, timedelta
from apps.trade_flow.models.orders import Order
from .customer_factory import CustomerFactory


class OrderFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Order

    customer = factory.SubFactory(CustomerFactory)
    order_number = factory.Sequence(lambda n: f"ORD-{n:04}")
    order_date = factory.LazyFunction(date.today)
    product_name = factory.Faker("word")
    quantity = factory.Faker("random_int", min=1, max=100)
    price = factory.Faker("random_int", min=1000, max=100000)
    deadline = factory.LazyFunction(lambda: date.today() + timedelta(days=30))
    note = factory.Faker("sentence")