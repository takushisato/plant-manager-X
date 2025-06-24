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
from apps.mail.models.mail_group_record import MailGroupRecord


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

        result = []
        for group in groups:
            histories = group.mailhistory_set.all()
            for history in histories:
                result.append({
                    "id": group.id,
                    "group_title": group.group_title,
                    "note": group.note,
                    "history": {
                        "id": history.id,
                        "sent_at": history.sent_at,
                        "title": history.title,
                        "message": history.message
                    }
                })

        return Response(result, status=status.HTTP_200_OK)

    @extend_schema(
        request=MailGroupCreateSerializer,
        responses={201: MailGroupCreateSerializer},
        tags=["mail"],
        description="メールグループを新規作成"
    )
    def post(self, request):
        check_mail_access_permission(request)
        serializer = MailGroupCreateSerializer(data=request.data, context={"create_user": request.user})
        serializer.is_valid(raise_exception=True)
        mail_group = serializer.save()
        return Response(MailGroupWithRecordSerializer(mail_group).data, status=status.HTTP_201_CREATED)