from rest_framework.exceptions import PermissionDenied


def check_material_access_permission(request):
    """
    資材閲覧権限チェック
    """
    if not (request.permission.material_access or request.permission.master_data_access):
        raise PermissionDenied("認証は確認しましたが権限がありません。")
