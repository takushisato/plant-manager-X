import pytest
from datetime import date, timedelta
from apps.trade_flow.models.orders import Order
from tests.factory.order_factory import OrderFactory
from tests.factory.customer_factory import CustomerFactory


@pytest.mark.django_db
def test_create_order_with_factory():
    """
    OrderFactory で正常に注文が作成できることを確認
    """
    order = OrderFactory()
    assert order.customer is not None
    assert isinstance(order.order_date, date)
    assert isinstance(order.deadline, date)
    assert isinstance(order.quantity, int)
    assert isinstance(order.price, int)
    assert order.product_name


@pytest.mark.django_db
def test_order_str_method():
    """
    __str__ が product_name を返すことを確認
    """
    order = OrderFactory(product_name="高性能ドライバー")
    assert str(order) == "高性能ドライバー"


@pytest.mark.django_db
def test_order_all_fields_filled():
    """
    すべてのフィールドに値が入っていても正しく作成できることを確認
    """
    customer = CustomerFactory(customer_name="株式会社〇〇")
    order = Order.objects.create(
        customer=customer,
        order_number="ORD-20250401",
        order_date=date.today(),
        product_name="電動レンチ",
        quantity=5,
        price=50000,
        deadline=date.today() + timedelta(days=10),
        note="優先出荷希望"
    )
    assert order.customer.customer_name == "株式会社〇〇"
    assert order.product_name == "電動レンチ"
    assert order.note == "優先出荷希望"
