from django.urls import path
from apps.mail.views.mail_group_create_view import MailGroupCreateView
from apps.mail.views.mail_group_detail_create_view import MailGroupDetailBulkCreateView
from apps.mail.views.mail_group_list_view import MailGroupListView
from apps.mail.views.mail_group_delete_view import MailGroupDeleteView
from apps.mail.views.mail_send_view import MailSendView


urlpatterns = [
    path("groups/", MailGroupListView.as_view(), name="mail-group-list"),
    path("groups/create/", MailGroupCreateView.as_view(), name="mailgroup-create"),
    path("groups/<int:pk>/delete/", MailGroupDeleteView.as_view(), name="mail-group-delete"),
    path("groups/details/bulk-create/", MailGroupDetailBulkCreateView.as_view(), name="mail-group-detail-bulk-create"),
    path("send/", MailSendView.as_view(), name="mail-send"),
]