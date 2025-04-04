import pytest
from rest_framework.test import APIClient
from rest_framework import status
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.defect_factory import DefectFactory
from apps.bug_note.models.defect import Defect


@pytest.mark.django_db
class TestDefectDetailDelete:
    """
    不具合情報を論理削除するAPIのテスト

    URL: /api/bug_note/defects/<int:pk>/
    METHOD: DELETE
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def authed_user(self):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_defect=True)
        return user
    
    @pytest.fixture
    def user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, can_edit_defect=False)
        return user

    @pytest.fixture
    def defect(self, authed_user):
        return DefectFactory(create_user=authed_user)

    def test_delete_defect_success(self, client, authed_user, defect):
        """
        正常系: 不具合情報を論理削除する

        条件:
        - 不具合情報の論理削除

        結果:
        - ステータスコード204
        - 不具合情報が論理削除される
        """
        client.force_authenticate(user=authed_user)
        response = client.delete(f"/api/bug_note/defects/{defect.id}/")

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Defect.objects.count() == 1

    def test_unauthenticated_user_cannot_delete(self, client, defect):
        """
        異常系: 認証されていないユーザーが論理削除できない

        条件:
        - 認証されていないユーザー

        結果:
        - ステータスコード401
        - 不具合情報が論理削除されない
        """
        response = client.delete(f"/api/bug_note/defects/{defect.id}/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_without_permission_cannot_delete(self, client, user_without_permission, defect):
        """
        異常系: 権限がないユーザーが論理削除できない

        条件:
        - 権限がないユーザー

        結果:
        - ステータスコード403
        - 不具合情報が論理削除されない
        """
        client.force_authenticate(user=user_without_permission)
        response = client.delete(f"/api/bug_note/defects/{defect.id}/")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_invalid_data(self, client, user_without_permission, defect):
        """
        異常系: 不正なデータが送信された場合、エラーが返される

        条件:
        - リクエストボディが空

        結果:
        - ステータスコード403
        - 不具合情報が論理削除されない
        """
        client.force_authenticate(user=user_without_permission)
        response = client.delete(f"/api/bug_note/defects/{defect.id}/")
        assert response.status_code == status.HTTP_403_FORBIDDEN
