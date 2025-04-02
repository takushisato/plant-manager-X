from django.urls import path
from apps.attendance.views import RecordCreateView, MonthlyAttendanceRecordListView, MonthlyAttendanceRecordAllListView


urlpatterns = [
    path("record/create/", RecordCreateView.as_view(), name="attendance-record-create"),
    path("records/list/", MonthlyAttendanceRecordListView.as_view(), name="attendance-record-list"),
    path("records/all/list/", MonthlyAttendanceRecordAllListView.as_view(), name="attendance-record-all-list"),
]
