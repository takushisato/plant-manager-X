from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from apps.mail.models.mail_group_record import MailGroupRecord
from apps.mail.serializer import MailSendSerializer
from apps.staff_hub.permission_check import HasUserPermissionObject
from apps.mail.common import check_mail_access_permission
from drf_spectacular.utils import extend_schema, OpenApiResponse
from apps.utility.const import MESSAGES
from apps.mail.views.validations import (
    validate_mail_group_ownership,
    get_recipient_emails,
    validate_recipient_emails,
    save_mail_template,
)
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.exceptions import ValidationError


class MailSendView(APIView):
    permission_classes = [permissions.IsAuthenticated, HasUserPermissionObject]

    @extend_schema(
        request=MailSendSerializer,
        responses={200: OpenApiResponse(description="送信完了")},
        tags=["mail"],
        description="メールグループに対してメールを送信し、履歴を保存"
    )
    def post(self, request):
        check_mail_access_permission(request)

        serializer = MailSendSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        mail_group = serializer.validated_data["mail_group_id"]
        title = serializer.validated_data["title"]
        message = serializer.validated_data["message"]

        validate_mail_group_ownership(mail_group, request.user)

        recipients = MailGroupRecord.get_mail_group_records_by_mail_group(
            mail_group
        )
        to_emails = get_recipient_emails(recipients)

        validate_recipient_emails(to_emails)

        _send_mail(title, message, to_emails)
        save_mail_template(mail_group, title, message)

        return Response({"detail": MESSAGES["SEND_MAIL"]}, status=200)


def _send_mail(subject, message, to_list):
    """
    メールを送信
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=to_list,
            fail_silently=False,
        )
    except Exception:
        raise ValidationError(MESSAGES["SEND_MAIL_EXECUTE_ERROR"])
