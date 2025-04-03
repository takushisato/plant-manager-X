from django.urls import path
from apps.mail.views.mail_group_detail_create_view import MailGroupDetailBulkCreateView
from apps.mail.views.mail_group_view import MailGroupView
from apps.mail.views.mail_group_delete_view import MailGroupDeleteView
from apps.mail.views.mail_send_view import MailSendView


urlpatterns = [
    path("groups/", MailGroupView.as_view(), name="mail-group"),
    path("groups/<int:pk>/delete/", MailGroupDeleteView.as_view(), name="mail-group-delete"),
    path("groups/details/bulk-create/", MailGroupDetailBulkCreateView.as_view(), name="mail-group-detail-bulk-create"),
    path("groups/send/", MailSendView.as_view(), name="mail-send"),
]