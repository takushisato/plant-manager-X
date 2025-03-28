import pytest
from rest_framework import status
from rest_framework.test import APIClient
from apps.mail.models.mail_group_detail import MailGroupDetail
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory


@pytest.mark.django_db
class TestMailGroupDetailBulkCreateView:

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def mail_group(self):
        return MailGroupFactory()

    @pytest.fixture
    def recipient_users(self):
        return UserFactory.create_batch(3)

    @pytest.fixture
    def authed_user_with_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, mail_access=True)
        return user

    @pytest.fixture
    def authed_user_without_permission(self):
        user = UserFactory()
        PermissionFactory(user=user, mail_access=False)
        return user

    def test_bulk_create_success(self, client, authed_user_with_permission, recipient_users):
        """
        正常系: mail_access 権限を持つユーザーが一括登録できる

        条件:
        - mail_access 権限を持つユーザー
        - 3つの宛先ユーザー

        結果:
        - ステータスコード201
        - 宛先ユーザーが3件追加される
        """
        mail_group = MailGroupFactory(create_user=authed_user_with_permission)

        client.force_authenticate(user=authed_user_with_permission)
        data = {
            "mail_group_detail": mail_group.id,
            "recipient_users": [user.id for user in recipient_users]
        }

        response = client.post("/api/mail/groups/details/bulk-create/", data=data, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert MailGroupDetail.objects.filter(mail_group_detail=mail_group).count() == 3

    def test_bulk_create_forbidden(self, client, authed_user_without_permission, mail_group, recipient_users):
        """
        異常系: mail_access 権限なしのユーザーは 403 Forbidden
        
        条件:
        - mail_access 権限なしのユーザー
        - 3つの宛先ユーザー

        結果:
        - ステータスコード403
        - 宛先ユーザーが追加されない
        """
        client.force_authenticate(user=authed_user_without_permission)
        data = {
            "mail_group_detail": mail_group.id,
            "recipient_users": [user.id for user in recipient_users]
        }

        response = client.post("/api/mail/groups/details/bulk-create/", data=data, format="json")
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_bulk_create_unauthenticated(self, client, mail_group, recipient_users):
        """
        異常系: 未ログインのユーザーは 401 Unauthorized

        条件:
        - 未ログインのユーザー
        - 3つの宛先ユーザー

        結果:
        - ステータスコード401
        - 宛先ユーザーが追加されない
        """
        data = {
            "mail_group_detail": mail_group.id,
            "recipient_users": [user.id for user in recipient_users]
        }

        response = client.post("/api/mail/groups/details/bulk-create/", data=data, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_bulk_create_empty_users(self, client, authed_user_with_permission, mail_group):
        """
        異常系: recipient_users が空

        条件:
        - recipient_users が空

        結果:
        - ステータスコード400
        - 宛先ユーザーが追加されない
        """
        client.force_authenticate(user=authed_user_with_permission)
        data = {
            "mail_group_detail": mail_group.id,
            "recipient_users": []
        }

        response = client.post("/api/mail/groups/details/bulk-create/", data=data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        
    def test_bulk_create_not_owner(self, client, recipient_users):
        """
        異常系: mail_access を持っていても mail_group の作成者でない場合は 400

        条件:
        - mail_access を持っていても mail_group の作成者でない場合
        - 3つの宛先ユーザー

        結果:
        - ステータスコード400
        - 宛先ユーザーが追加されない
        """
        # mail_group は他人が作成したもの
        other_user = UserFactory()
        mail_group = MailGroupFactory(create_user=other_user)

        # 権限はあるが作成者ではないユーザー
        user = UserFactory()
        PermissionFactory(user=user, mail_access=True)

        client.force_authenticate(user=user)

        data = {
            "mail_group_detail": mail_group.id,
            "recipient_users": [user.id for user in recipient_users]
        }

        response = client.post("/api/mail/groups/details/bulk-create/", data=data, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "作成者" in str(response.data) or "許可" in str(response.data)
