from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema
from apps.mail.models.mail_group import MailGroup
from apps.mail.serializer import MailGroupWithRecordSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from apps.mail.common import check_mail_access_permission
from apps.mail.serializer import MailGroupCreateSerializer

class MailGroupView(APIView):
    permission_classes = [IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        responses={200: MailGroupWithRecordSerializer(many=True)},
        tags=["mail"],
        description="メールグループ一覧を宛先ユーザーとともに取得"
    )
    def get(self, request):
        check_mail_access_permission(request)
        groups = MailGroup.get_with_records_by_user(request.user)
        serializer = MailGroupWithRecordSerializer(groups, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        request=MailGroupCreateSerializer,
        responses={201: MailGroupCreateSerializer},
        tags=["mail"],
        description="メールグループを新規作成"
    )
    def post(self, request):
        check_mail_access_permission(request)
        serializer = MailGroupCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mail_group = serializer.save(create_user=request.user)
        return Response(MailGroupCreateSerializer(mail_group).data, status=status.HTTP_201_CREATED)
