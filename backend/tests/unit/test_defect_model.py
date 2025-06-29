import pytest
from datetime import datetime, timedelta
from apps.bug_note.models.defect import Defect
from tests.factory.defect_factory import DefectFactory
from tests.factory.user_factory import UserFactory
from tests.factory.order_factory import OrderFactory


@pytest.mark.django_db
def test_create_defect_with_factory():
    """
    DefectFactory で正しく不具合インスタンスが作成されることを確認
    """
    defect = DefectFactory()
    assert defect.create_user is not None
    assert defect.order is not None
    assert isinstance(defect.occurred_at, datetime)
    assert isinstance(defect.submission_deadline, datetime)
    assert isinstance(defect.title, str)
    assert isinstance(defect.defect_detail, str)
    assert isinstance(defect.submission, str)


@pytest.mark.django_db
def test_defect_str_method():
    """
    __str__ メソッドが title を返すことを確認
    """
    defect = DefectFactory(title="モーター動作不良")
    assert str(defect) == "モーター動作不良"


@pytest.mark.django_db
def test_defect_all_fields_filled():
    """
    すべてのフィールドが埋まっている状態で正しく保存されることを確認
    """
    user = UserFactory(name="品質管理 太郎")
    order = OrderFactory(product_name="テスト機器A")
    defect = Defect.objects.create(
        create_user=user,
        order=order,
        occurred_at=datetime(2025, 4, 1, 14, 30),
        title="異音発生",
        defect_detail="使用中に異常音が発生。動作に支障あり。",
        submission="ベアリング交換予定。根本原因調査中。",
        submission_deadline=datetime(2025, 4, 5, 17, 0),
    )
    assert defect.create_user.name == "品質管理 太郎"
    assert defect.order.product_name == "テスト機器A"
    assert defect.title == "異音発生"


@pytest.mark.django_db
def test_get_defects_by_month_returns_only_not_deleted():
    """
    get_defects_by_month が deleted_at が null の不具合のみを取得することを確認
    """
    # 通常データ2件
    defect1 = DefectFactory()
    defect2 = DefectFactory()

    # 削除済み（論理削除）データ1件
    deleted_defect = DefectFactory()
    deleted_defect.deleted_at = datetime.now()
    deleted_defect.save()

    defects = Defect.get_defects_by_month()

    assert defect1 in defects
    assert defect2 in defects
    assert deleted_defect not in defects
    assert defects.count() == 2
