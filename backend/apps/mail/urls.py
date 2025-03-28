from django.urls import path
from apps.mail.views.mail_group_create_view import MailGroupCreateView
from apps.mail.views.mail_group_detail_create_view import MailGroupDetailBulkCreateView
from apps.mail.views.mail_group_list_view import MailGroupListView


urlpatterns = [
    path("groups/", MailGroupListView.as_view(), name="mail-group-list"),
    path("groups/create/", MailGroupCreateView.as_view(), name="mailgroup-create"),
    path("groups/details/bulk-create/", MailGroupDetailBulkCreateView.as_view(), name="mail-group-detail-bulk-create"),
]