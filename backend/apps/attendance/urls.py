from django.urls import path
from apps.attendance.views import AttendanceRecordCreateView


urlpatterns = [
    path("record/create/", AttendanceRecordCreateView.as_view(), name="attendance-record-create"),
]
