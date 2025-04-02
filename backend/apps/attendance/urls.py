from django.urls import path
from apps.attendance.views import RecordCreateView, MonthlyAttendanceRecordListView, MonthlyAttendanceRecordAllListView, RecordUpdateView


urlpatterns = [
    path("records/create/", RecordCreateView.as_view(), name="attendance-record-create"),
    path("records/<int:pk>/update/", RecordUpdateView.as_view(), name="attendance-record-update"),
    path("records/my_list/", MonthlyAttendanceRecordListView.as_view(), name="attendance-record-my-list"),
    path("records/all_list/", MonthlyAttendanceRecordAllListView.as_view(), name="attendance-record-all-list"),
]