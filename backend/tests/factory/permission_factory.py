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
    can_manage_own_attendance = False
    can_manage_all_attendance = False
    can_view_production_plan = False
    can_edit_production_plan = False
    can_view_order = False
    can_edit_order = False
    can_view_defect = False
    can_edit_defect = False
    mail_access = False
    master_data_access = False

    class Params:
        full_access = factory.Trait(
            staff_hub_access=True,
            material_access=True,
            can_manage_own_attendance=True,
            can_manage_all_attendance=True,
            can_view_production_plan=True,
            can_edit_production_plan=True,
            can_view_order=True,
            can_edit_order=True,
            can_view_defect=True,
            can_edit_defect=True,
            mail_access=True,
            master_data_access=True,
        )
        material_only = factory.Trait(
            material_access=True
        )
        master_only = factory.Trait(
            master_data_access=True
        )
