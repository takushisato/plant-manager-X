from rest_framework.exceptions import PermissionDenied


def check_mail_access_permission(request):
    """
    メール閲覧権限チェック
    """
    if not (request.permission.mail_access):
        raise PermissionDenied("認証は確認しましたが権限がありません。")
