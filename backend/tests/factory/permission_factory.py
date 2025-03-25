import factory
from apps.staff_hub.models import Permission
from .user_factory import UserFactory

class PermissionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Permission

    user = factory.SubFactory(UserFactory)
    staff_hub_access = True
    material_access = False
    attendance_access = True
    prod_flow_access = False
    trade_flow_access = True
    bug_note_access = False
    mail_access = True
    master_data_access = False