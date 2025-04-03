import pytest
from apps.material.models.material import Material
from tests.factory.material_factory import MaterialFactory
from tests.factory.organization_factory import OrganizationFactory
from django.http import Http404
from django.db import transaction


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


@pytest.mark.django_db
def test_get_locked_returns_material():
    """
    get_locked で指定IDの資材が select_for_update 付きで取得できること
    """
    material = MaterialFactory()

    with transaction.atomic():
        locked_material = Material.get_locked(material.pk)
        assert locked_material.pk == material.pk
        assert locked_material.material_name == material.material_name


@pytest.mark.django_db
def test_get_locked_raises_404_when_not_found():
    """
    get_locked で存在しないIDを指定した場合に Http404 が発生すること
    """
    invalid_id = 9999  # 存在しないID

    with pytest.raises(Http404):
        with transaction.atomic():
            Material.get_locked(invalid_id)