from django.urls import path
from apps.attendance.views import RecordCreateView, MonthlyAttendanceRecordListView, MonthlyAttendanceRecordAllListView, RecordUpdateView


urlpatterns = [
    path("records/list/", MonthlyAttendanceRecordListView.as_view(), name="attendance-record-list"),
    path("record/create/", RecordCreateView.as_view(), name="attendance-record-create"),
    path("records/<int:pk>/update/", RecordUpdateView.as_view(), name="attendance-record-update"),
    path("records/all/list/", MonthlyAttendanceRecordAllListView.as_view(), name="attendance-record-all-list"),
]