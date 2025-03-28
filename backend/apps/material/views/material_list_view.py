from rest_framework import generics, permissions
from apps.material.models.material import Material
from apps.material.serializers import MaterialSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from rest_framework.exceptions import PermissionDenied


class MaterialListView(generics.ListAPIView):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    def get_queryset(self):
        _check_material_access_permission(self.request)
        user = self.request.user
        return Material.objects.filter(organization=user.organization)

def _check_material_access_permission(request):
    """
    資材閲覧権限チェック
    """
    if not (request.permission.material_access or request.permission.master_data_access):
        raise PermissionDenied("認証は確認しましたが権限がありません。")