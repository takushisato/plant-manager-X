from django.contrib.auth import get_user_model
from rest_framework import serializers
from djoser.serializers import UserSerializer as DjoserUserSerializer
from apps.staff_hub.models import Permission

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email')


class CustomUserSerializer(DjoserUserSerializer):
    permission = serializers.SerializerMethodField()

    class Meta(DjoserUserSerializer.Meta):
        fields = DjoserUserSerializer.Meta.fields + ('permission',)

    def get_permission(self, obj):
        try:
            permission = obj.permission
            return {
                "staff_hub_access": permission.staff_hub_access,
                "material_access": permission.material_access,
                "can_manage_own_attendance": permission.can_manage_own_attendance,
                "can_manage_all_attendance": permission.can_manage_all_attendance,
                "can_view_production_plan": permission.can_view_production_plan,
                "can_edit_production_plan": permission.can_edit_production_plan,
                "can_view_order": permission.can_view_order,
                "can_edit_order": permission.can_edit_order,
                "can_view_defect": permission.can_view_defect,
                "can_edit_defect": permission.can_edit_defect,
                "mail_access": permission.mail_access,
                "master_data_access": permission.master_data_access,
            }
        except Permission.DoesNotExist:
            return None