import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.defect_factory import DefectFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestDefectDetailGet:
    """
    不具合詳細取得APIのテスト

    URL: /api/bug_note/defects/<int:pk>/
    METHOD: GET
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_defect=True)
        return user

    @pytest.fixture
    def user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_view_defect=False)
        return user

    @pytest.fixture
    def defect(self, user_with_permission):
        return DefectFactory(create_user=user_with_permission)

    def test_get_defect_detail_success(self, client, user_with_permission, defect):
        """
        正常系: 不具合詳細を取得できる

        条件:
        - 認証されたユーザー
        - 不具合情報が存在する

        結果:
        - ステータスコード200
        - 不具合詳細が取得できる
        """
        client.force_authenticate(user=user_with_permission)
        response = client.get(f"/api/bug_note/defects/{defect.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["id"] == defect.id

    def test_get_defect_detail_unauthorized(self, client, defect):
        """
        認証されていないユーザーが不具合詳細を取得しようとした場合

        条件:
        - 認証されていないユーザー
        - 不具合情報が存在する

        結果:
        - ステータスコード401
        - エラーメッセージが返される
        """
        response = client.get(f"/api/bug_note/defects/{defect.id}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_defect_detail_forbidden(self, client, user_without_permission, defect):
        """
        閲覧権限がないユーザーが不具合詳細を取得しようとした場合

        条件:
        - 認証されているが閲覧権限がないユーザー
        - 不具合情報が存在する

        結果:
        - ステータスコード403
        - エラーメッセージが返される
        """
        client.force_authenticate(user=user_without_permission)
        response = client.get(f"/api/bug_note/defects/{defect.id}/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_get_defect_detail_not_found(self, client, user_with_permission):
        """
        存在しない不具合情報を取得しようとした場合

        条件:
        - 認証されたユーザー
        - 不具合情報が存在しない

        結果:
        - ステータスコード404
        - エラーメッセージが返される
        """
        client.force_authenticate(user=user_with_permission)
        response = client.get(f"/api/bug_note/defects/999999/")
        assert response.status_code == status.HTTP_404_NOT_FOUND
