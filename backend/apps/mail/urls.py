from django.urls import path
from apps.mail.views.mail_group_view import MailGroupView
from apps.mail.views.mail_group_record_view import MailGroupRecordView
from apps.mail.views.mail_send_view import MailSendView


urlpatterns = [
    path("groups/", MailGroupView.as_view(), name="mail-group"),
    path("groups/<int:pk>/", MailGroupRecordView.as_view(), name="mail-group-record"),
    path("groups/send/", MailSendView.as_view(), name="mail-group-send"),
]
