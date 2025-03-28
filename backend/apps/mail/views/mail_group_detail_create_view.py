from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from drf_spectacular.utils import extend_schema

from apps.mail.serializer import MailGroupDetailBulkCreateSerializer
from apps.mail.models.mail_group_detail import MailGroupDetail
from apps.staff_hub.permission import HasUserPermissionObject
from apps.mail.common import check_mail_access_permission


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

        MailGroupDetail.bulk_create_details(mail_group, users)

        return Response({"detail": "宛先を一括登録しました。"}, status=status.HTTP_201_CREATED)