import factory
from datetime import datetime
from apps.mail.models.mail_template import MailTemplate
from tests.factory.mail_group_factory import MailGroupFactory


class MailTemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MailTemplate

    mail_group = factory.SubFactory(MailGroupFactory)
    sent_at = factory.LazyFunction(datetime.now)
    title = factory.Faker("sentence", nb_words=4)
    message = factory.Faker("paragraph", nb_sentences=3)
