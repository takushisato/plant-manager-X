import pytest
from apps.trade_flow.models.customer import Customer
from tests.factory.customer_factory import CustomerFactory


@pytest.mark.django_db
def test_create_customer_with_factory():
    """
    CustomerFactory を使ってインスタンスを正しく作成できることを確認
    """
    customer = CustomerFactory()
    assert customer.customer_name
    assert customer.email
    assert customer.telephone
    assert customer.client_contact
    assert customer.internal_contact


@pytest.mark.django_db
def test_customer_str_method():
    """
    __str__ メソッドが customer_name を返すことを確認
    """
    customer = CustomerFactory(customer_name="株式会社テスト")
    assert str(customer) == "株式会社テスト"


@pytest.mark.django_db
def test_customer_nullable_fields():
    """
    nullable フィールドが空でも作成可能なことを確認
    """
    customer = Customer.objects.create(
        customer_name="シンプル顧客"
        # 他のフィールドは省略
    )
    assert customer.email is None
    assert customer.fax is None
    assert customer.note is None


@pytest.mark.django_db
def test_customer_all_fields_filled():
    """
    すべてのフィールドに値が入っている場合でも、正しく作成できることを確認
    """
    customer = Customer.objects.create(
        customer_name="株式会社フルフィル",
        telephone="03-1234-5678",
        fax="03-8765-4321",
        email="fullfill@example.com",
        postal_code="123-4567",
        address="東京都中央区1-1-1",
        client_contact="山田 太郎",
        internal_contact="佐藤 花子",
        note="これは備考欄のテストです。",
    )
    assert customer.customer_name == "株式会社フルフィル"
    assert customer.telephone == "03-1234-5678"
    assert customer.fax == "03-8765-4321"
    assert customer.email == "fullfill@example.com"
    assert customer.postal_code == "123-4567"
    assert customer.address == "東京都中央区1-1-1"
    assert customer.client_contact == "山田 太郎"
    assert customer.internal_contact == "佐藤 花子"
    assert customer.note == "これは備考欄のテストです。"
