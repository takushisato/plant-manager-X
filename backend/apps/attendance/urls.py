from django.urls import path
from apps.attendance.views import RecordCreateView


urlpatterns = [
    path("record/create/", RecordCreateView.as_view(), name="attendance-record-create"),
]
