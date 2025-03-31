from rest_framework.exceptions import PermissionDenied


def check_prod_flow_access_permission(request):
    """
    生産計画閲覧権限チェック
    """
    if not (request.permission.can_view_production_plan or request.permission.can_edit_production_plan or request.permission.master_data_access):
        raise PermissionDenied("認証は確認しましたが権限がありません。")

def check_prod_flow_edit_permission(request):
    """
    生産計画編集権限チェック
    """
    if not (request.permission.can_edit_production_plan or request.permission.master_data_access):
        raise PermissionDenied("認証は確認しましたが権限がありません。")

