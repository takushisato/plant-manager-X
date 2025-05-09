import pytest
from django.db.utils import IntegrityError
from apps.staff_hub.models.organization import Organization
from tests.factory.organization_factory import OrganizationFactory


@pytest.mark.django_db
def test_create_organization():
    """
    Organization インスタンスを正常に作成できる
    """
    org = Organization.objects.create(
        organization_name="Test Company",
        description="これはテスト用の組織です。"
    )
    assert org.organization_name == "Test Company"
    assert org.description == "これはテスト用の組織です。"


@pytest.mark.django_db
def test_organization_str():
    """
    __str__ メソッドが organization_name を返すこと
    """
    org = OrganizationFactory(organization_name="My Org")
    assert str(org) == "My Org"


@pytest.mark.django_db
def test_organization_name_unique():
    """
    organization_name がユニークであることを確認する
    """
    Organization.objects.create(organization_name="UniqueOrg")
    with pytest.raises(IntegrityError):
        Organization.objects.create(organization_name="UniqueOrg")
