from rest_framework.exceptions import PermissionDenied


def check_trade_flow_view_permission(request):
    """
    受注閲覧権限チェック
    """
    if not (request.permission.can_view_order or request.permission.can_edit_order or request.permission.master_data_access):
        raise PermissionDenied("認証は確認しましたが権限がありません。")

def check_trade_flow_edit_permission(request):
    """
    受注編集権限チェック
    """
    if not (request.permission.can_edit_order or request.permission.master_data_access):
        raise PermissionDenied("認証は確認しましたが権限がありません。")

