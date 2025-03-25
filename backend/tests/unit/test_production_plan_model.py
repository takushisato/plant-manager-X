import pytest
from datetime import date
from apps.prod_flow.models.production_plan import ProductionPlan
from tests.factory.production_plan_factory import ProductionPlanFactory
from tests.factory.organization_factory import OrganizationFactory


@pytest.mark.django_db
def test_create_production_plan_with_factory():
    """
    ProductionPlanFactory で正常に作成されることを確認
    """
    plan = ProductionPlanFactory()
    assert plan.organization is not None
    assert isinstance(plan.plan_date, date)
    assert isinstance(plan.note, str)


@pytest.mark.django_db
def test_production_plan_str_method():
    """
    __str__ メソッドが '組織名 - 計画日' を返すことを確認
    """
    org = OrganizationFactory(organization_name="テスト工場")
    plan = ProductionPlan.objects.create(
        organization=org,
        plan_date=date(2025, 4, 1),
        note="予定あり"
    )
    assert str(plan) == "テスト工場 - 2025-04-01"