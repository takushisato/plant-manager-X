from rest_framework import permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from apps.mail.common import check_mail_access_permission
from apps.mail.serializer import MailGroupCreateSerializer
from apps.staff_hub.permission import HasUserPermissionObject


@extend_schema(
    request=MailGroupCreateSerializer,
    responses={201: MailGroupCreateSerializer},
    tags=["mail"],
    description="メールグループを新規作成"
)   
class MailGroupCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    def post(self, request):
        check_mail_access_permission(request)
        serializer = MailGroupCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        mail_group = serializer.save(create_user=request.user)
        return Response(MailGroupCreateSerializer(mail_group).data, status=status.HTTP_201_CREATED)
