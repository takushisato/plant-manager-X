import factory
from apps.staff_hub.models import Permission
from .user_factory import UserFactory

import factory
from apps.staff_hub.models import Permission
from tests.factory.user_factory import UserFactory


class PermissionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Permission

    user = factory.SubFactory(UserFactory)
    staff_hub_access = False
    material_access = False
    attendance_access = False
    prod_flow_access = False
    trade_flow_access = False
    bug_note_access = False
    mail_access = False
    master_data_access = False

    class Params:
        full_access = factory.Trait(
            staff_hub_access=True,
            material_access=True,
            attendance_access=True,
            prod_flow_access=True,
            trade_flow_access=True,
            bug_note_access=True,
            mail_access=True,
            master_data_access=True,
        )
        material_only = factory.Trait(
            material_access=True
        )
        master_only = factory.Trait(
            master_data_access=True
        )
