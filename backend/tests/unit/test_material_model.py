import pytest
from apps.material.models.material import Material
from tests.factory.material_factory import MaterialFactory
from tests.factory.organization_factory import OrganizationFactory


@pytest.mark.django_db
def test_create_material_with_factory():
    """
    MaterialFactory でインスタンスが正しく作成されることを確認
    """
    material = MaterialFactory()
    assert material.material_name
    assert material.organization is not None
    assert isinstance(material.material_price, float)
    assert isinstance(material.stock_qty, int)
    assert isinstance(material.order_suggestion_qty, int)


@pytest.mark.django_db
def test_material_str_method():
    """
    __str__ メソッドが material_name を返すこと
    """
    material = MaterialFactory(material_name="資材A")
    assert str(material) == "資材A"


@pytest.mark.django_db
def test_material_default_values():
    """
    デフォルト値（stock_qty と order_suggestion_qty）が 0 であること
    """
    org = OrganizationFactory()
    material = Material.objects.create(
        organization=org,
        material_name="新しい資材"
    )
    assert material.stock_qty == 0
    assert material.order_suggestion_qty == 0