from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema

from apps.mail.serializer import MailGroupDetailBulkCreateSerializer
from apps.mail.models.mail_group_detail import MailGroupDetail
from apps.staff_hub.permission import HasUserPermissionObject
from apps.mail.common import check_mail_access_permission
from apps.utility.const import MESSAGES
from apps.mail.views.validations import validate_recipient_users, validate_mail_group_ownership


class MailGroupBulkCreateView(APIView):
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

        validate_recipient_users(users)
        validate_mail_group_ownership(mail_group, request.user)
        MailGroupDetail.bulk_create_details(mail_group, users)

        return Response({"detail": MESSAGES["MAIL_GROUP_DETAIL_BULK_CREATE"]}, status=status.HTTP_201_CREATED)
