import pytest
from datetime import date, timedelta
from apps.prod_flow.models.production_plan_record import ProductionPlanRecord
from tests.factory.production_plan_record_factory import ProductionPlanRecordFactory
from tests.factory.production_plan_factory import ProductionPlanFactory
from tests.factory.organization_factory import OrganizationFactory


@pytest.mark.django_db
def test_create_production_plan_detail_with_factory():
    """
    ProductionPlanRecordFactory で正しく作成されることを確認
    """
    record = ProductionPlanRecordFactory()
    assert record.production_plan is not None
    assert isinstance(record.title, str)
    assert isinstance(record.planned_start_date, date)
    assert isinstance(record.planned_end_date, date)
    assert isinstance(record.actual_start_date, date)
    assert isinstance(record.actual_end_date, date)
    assert isinstance(record.sort, int)


@pytest.mark.django_db
def test_production_plan_detail_str_method():
    """
    __str__ メソッドが「組織名 - タイトル」を返すことを確認
    """
    org = OrganizationFactory(organization_name="第一工場")
    plan = ProductionPlanFactory(organization=org)
    record = ProductionPlanRecord.objects.create(
        production_plan=plan,
        title="部品Aの製造",
        planned_start_date=date.today(),
        planned_end_date=date.today() + timedelta(days=2),
    )
    assert str(record) == "第一工場 - 部品Aの製造"


@pytest.mark.django_db
def test_nullable_actual_dates():
    """
    実績日が null 許容されていることを確認
    """
    record = ProductionPlanRecordFactory(actual_start_date=None, actual_end_date=None)
    assert record.actual_start_date is None
    assert record.actual_end_date is None
