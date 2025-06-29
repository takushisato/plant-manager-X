import pytest
from apps.staff_hub.models.user import User
from tests.factory.user_factory import UserFactory
from tests.factory.organization_factory import OrganizationFactory


@pytest.mark.django_db
def test_create_user_with_factory():
    """
    UserFactory を使ってユーザーを作成し、以下を確認する:
    - email が存在すること
    - organization に紐付いていること
    - is_active が True であること
    """
    user = UserFactory()
    assert user.email
    assert user.organization is not None
    assert user.is_active is True


@pytest.mark.django_db
def test_create_user_manager():
    """
    UserManager の create_user を使ってユーザーを作成し、以下を確認する:
    - email が正しく設定されていること
    - パスワードが正しくハッシュ化されていること
    - organization が設定されていること
    - is_staff が False であること（一般ユーザー）
    """
    org = OrganizationFactory()
    user = User.objects.create_user(
        email="user@example.com",
        password="securepassword",
        organization=org,
        name="Test User",
    )
    assert user.email == "user@example.com"
    assert user.check_password("securepassword")
    assert user.organization == org
    assert user.is_staff is False


@pytest.mark.django_db
def test_create_superuser_manager():
    """
    UserManager の create_superuser を使ってスーパーユーザーを作成し、以下を確認する:
    - is_superuser が True であること
    - is_staff が True であること
    """
    user = User.objects.create_superuser(
        email="admin@example.com", password="adminpassword", name="Admin User"
    )
    assert user.is_superuser is True
    assert user.is_staff is True
