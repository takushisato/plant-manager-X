import factory
from apps.mail.models.mail_group_record import MailGroupRecord
from tests.factory.mail_group_factory import MailGroupFactory
from tests.factory.user_factory import UserFactory


class MailGroupRecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MailGroupRecord

    mail_group_record = factory.SubFactory(MailGroupFactory)
    recipient_user = factory.SubFactory(UserFactory)
