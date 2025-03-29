import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.urls import reverse

from apps.mail.models.mail_group import MailGroup
from apps.mail.models.mail_group_detail import MailGroupDetail
from tests.factory.user_factory import UserFactory
from tests.factory.permission_factory import PermissionFactory
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.mail_group_detail_factory import MailGroupDetailFactory


@pytest.mark.django_db
class TestMailGroupDeleteView:
    """
    メールグループ削除APIのテスト

    URL: /api/mail/groups/<int:pk>/delete/
    METHOD: DELETE
    """

    @pytest.fixture
    def client(self):
        return APIClient()

    @pytest.fixture
    def user(self):
        user = UserFactory()
        PermissionFactory(user=user, mail_access=True)
        return user

    @pytest.fixture
    def other_user(self):
        user = UserFactory()
        PermissionFactory(user=user, mail_access=True)
        return user

    @pytest.fixture
    def mail_group(self, user):
        group = MailGroupFactory(create_user=user)
        MailGroupDetailFactory.create_batch(3, mail_group_detail=group)
        return group

    def test_delete_success(self, client, user, mail_group):
        """
        正常系: メールグループを削除できる

        条件:
        - メールグループの作成者
        - メールグループの関連する宛先も削除される

        結果:
        - ステータスコード204
        - メールグループが削除される
        - メールグループの関連する宛先も削除される
        """
        client.force_authenticate(user=user)
        response = client.delete(reverse("mail-group-delete", kwargs={"pk": mail_group.id}))
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not MailGroup.objects.filter(id=mail_group.id).exists()
        assert MailGroupDetail.objects.filter(mail_group_detail=mail_group).count() == 0

    def test_delete_not_owner(self, client, other_user, mail_group):
        """
        異常系: メールグループの作成者でない場合は削除できない

        条件:
        - メールグループの作成者でない

        結果:
        - ステータスコード403
        - メールグループが削除されない
        """
        client.force_authenticate(user=other_user)
        response = client.delete(reverse("mail-group-delete", kwargs={"pk": mail_group.id}))
        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert MailGroup.objects.filter(id=mail_group.id).exists()

    def test_delete_unauthenticated(self, client, mail_group):
        """
        異常系: 未認証の場合は削除できない

        条件:
        - 未認証

        結果:
        - ステータスコード401
        - メールグループが削除されない
        """
        response = client.delete(reverse("mail-group-delete", kwargs={"pk": mail_group.id}))
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
