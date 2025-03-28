from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from apps.mail.models.mail_group import MailGroup
from apps.mail.serializer import MailGroupWithDetailsSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.mail.common import check_mail_access_permission


class MailGroupListView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        responses={200: MailGroupWithDetailsSerializer(many=True)},
        tags=["mail"],
        description="メールグループ一覧を宛先ユーザーとともに取得"
    )
    def get(self, request):
        check_mail_access_permission(request)
        groups = MailGroup.get_with_details_by_user(request.user)
        serializer = MailGroupWithDetailsSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
