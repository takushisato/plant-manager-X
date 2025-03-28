from django.urls import path
from apps.mail.views.mail_group_create_view import MailGroupCreateView


urlpatterns = [
    path("groups/create/", MailGroupCreateView.as_view(), name="mailgroup-create"),
]