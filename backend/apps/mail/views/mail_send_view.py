from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from apps.mail.models.mail_group_detail import MailGroupDetail
from apps.mail.models.mail_template import MailTemplate
from apps.mail.serializer import MailSendSerializer
from apps.staff_hub.permission import HasUserPermissionObject
from apps.mail.common import check_mail_access_permission
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.exceptions import ValidationError, PermissionDenied


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

        _validate_mail_group_ownership(mail_group, request.user)

        recipients = MailGroupDetail.objects.filter(mail_group_detail=mail_group)
        to_emails = _get_recipient_emails(recipients)

        _validate_recipient_emails(to_emails)

        _send_mail(title, message, to_emails)
        _save_mail_template(mail_group, title, message)

        return Response({"detail": f"{len(to_emails)} 件のメールを送信しました。"}, status=200)
    

def _validate_mail_group_ownership(mail_group, user):
    """
    ログインユーザーがグループの作成者か確認
    """
    if mail_group.create_user != user:
        raise PermissionDenied("このグループへの送信権限がありません。")


def _get_recipient_emails(recipients):
    """
    有効なメールアドレス一覧を取得
    """
    return [r.recipient_user.email for r in recipients if r.recipient_user.email]


def _validate_recipient_emails(emails):
    """
    送信先が1件以上存在することを検証
    """
    if not emails:
        raise ValidationError("送信先ユーザーにメールアドレスが設定されていません。")


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
        raise ValidationError("メール送信に失敗しました。時間をおいて再度実行してください。この状態が長く続くようでしたら、管理者にお問い合わせください。")


def _save_mail_template(mail_group, title, message):
    """
    メール送信履歴を保存
    """
    MailTemplate.objects.create(
        mail_group=mail_group,
        sent_at=timezone.now(),
        title=title,
        message=message
    )
