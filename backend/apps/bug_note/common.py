from rest_framework.exceptions import PermissionDenied


def check_bug_note_view_permission(request):
    """
    不具合情報：閲覧権限チェック
    """
    if not (request.permission.can_view_defect or request.permission.can_edit_defect):
        raise PermissionDenied("認証は確認しましたが権限がありません。")


def check_bug_note_edit_permission(request):
    """
    不具合情報：編集権限チェック
    """
    if not (request.permission.can_edit_defect):
        raise PermissionDenied("認証は確認しましたが権限がありません。")
