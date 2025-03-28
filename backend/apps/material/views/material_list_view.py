from rest_framework import generics, permissions
from apps.material.models.material import Material
from apps.material.serializers import MaterialSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.material.common import check_material_access_permission


class MaterialListView(generics.ListAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    def get_queryset(self):
        check_material_access_permission(self.request)
        user = self.request.user
        return Material.objects.filter(organization=user.organization)
