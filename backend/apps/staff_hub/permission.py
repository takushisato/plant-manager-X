from rest_framework import permissions
from apps.staff_hub.models import Permission

class HasUserPermissionObject(permissions.BasePermission):
    """
    Permissionを返却
    """
    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            return False

        try:
            request.permission = user.permission
            return True
        except Permission.DoesNotExist:
            return False
