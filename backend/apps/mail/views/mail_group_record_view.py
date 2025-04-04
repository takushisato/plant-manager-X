from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from drf_spectacular.utils import extend_schema
from django.shortcuts import get_object_or_404

from apps.mail.models.mail_group import MailGroup
from apps.staff_hub.permission import HasUserPermissionObject
from apps.mail.common import check_mail_access_permission
from apps.utility.const import MESSAGES


class MailGroupRecordView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        tags=["mail"],
        description="メールグループを削除（関連する宛先も削除）",
        responses={204: None}
    )
    def delete(self, request, pk):
        check_mail_access_permission(request)

        mail_group = get_object_or_404(MailGroup, pk=pk)

        if mail_group.create_user != request.user:
            return Response({"detail": MESSAGES["MAIL_GROUP_DELETE_ERROR"]}, status=status.HTTP_403_FORBIDDEN)

        mail_group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
