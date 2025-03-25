import factory
from apps.mail.models.mail_group import MailGroup
from tests.factory.user_factory import UserFactory


class MailGroupFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MailGroup

    create_user = factory.SubFactory(UserFactory)
    group_title = factory.Faker("company")
    note = factory.Faker("sentence")
