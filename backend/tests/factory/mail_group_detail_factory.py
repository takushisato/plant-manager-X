import factory
from apps.mail.models.mail_group_detail import MailGroupDetail
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.user_factory import UserFactory


class MailGroupDetailFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MailGroupDetail

    mail_group_detail = factory.SubFactory(MailGroupFactory)
    recipient_user = factory.SubFactory(UserFactory)
