from rest_framework.exceptions import PermissionDenied


def check_attendance_own_edit_permission(request):
    """
    自分の勤怠のみ編集できる権限
    """
    if not (request.permission.can_manage_own_attendance):
        raise PermissionDenied("認証は確認しましたが権限がありません。")

def check_attendance_all_edit_permission(request):
    """
    全員の勤怠を編集できる権限
    """
    if not (request.permission.can_manage_all_attendance):
        raise PermissionDenied("認証は確認しましたが権限がありません。")

