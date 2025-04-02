from django.urls import path
from apps.attendance.views import MyAttendanceRecordCreateView


urlpatterns = [
    path("record/create/", MyAttendanceRecordCreateView.as_view(), name="attendance-record-create"),
]
