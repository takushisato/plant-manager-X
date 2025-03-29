from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema

from apps.mail.serializer import MailGroupDetailBulkCreateSerializer
from apps.mail.models.mail_group_detail import MailGroupDetail
from apps.staff_hub.permission import HasUserPermissionObject
from apps.mail.common import check_mail_access_permission
from rest_framework.exceptions import ValidationError
from apps.utility.const import MESSAGES


class MailGroupDetailBulkCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=MailGroupDetailBulkCreateSerializer,
        responses={201: None},
        tags=["mail"],
        description="複数の宛先ユーザーをメールグループ詳細に一括追加"
    )
    def post(self, request):
        check_mail_access_permission(request)
        serializer = MailGroupDetailBulkCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mail_group = serializer.validated_data["mail_group_detail"]
        users = serializer.validated_data["recipient_users"]

        _validate_recipient_users(users)
        _validate_mail_group_owner(mail_group, request.user)
        MailGroupDetail.bulk_create_details(mail_group, users)

        return Response({"detail": MESSAGES["MAIL_GROUP_DETAIL_BULK_CREATE"]}, status=status.HTTP_201_CREATED)

def _validate_recipient_users(users):
    """
    recipient_users が空でないことを検証する
    """
    if not users:
        raise ValidationError(MESSAGES["MAIL_GROUP_DETAIL_BULK_CREATE_ERROR"])

def _validate_mail_group_owner(mail_group, user):
    """
    mail_group の作成者であることを検証する
    """
    if mail_group.create_user != user:
        raise ValidationError(MESSAGES["MAIL_GROUP_DETAIL_BULK_CREATE_OWNER_ERROR"])

