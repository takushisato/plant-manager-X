from django.urls import path
from apps.attendance.views import RecordCreateView, MonthlyAttendanceRecordListView


urlpatterns = [
    path("record/create/", RecordCreateView.as_view(), name="attendance-record-create"),
    path("records/list/", MonthlyAttendanceRecordListView.as_view(), name="attendance-record-list"),
]
