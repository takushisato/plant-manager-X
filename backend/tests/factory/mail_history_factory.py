import factory
from apps.mail.models.mail_history import MailHistory
from tests.factory.mail_group_factory import MailGroupFactory


class MailHistoryFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MailHistory

    mail_group = factory.SubFactory(MailGroupFactory)
    title = factory.Faker("sentence")
    message = factory.Faker("paragraph")
    sent_at = factory.Faker("date_time_this_year")
