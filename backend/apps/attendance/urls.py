from django.urls import path
from apps.attendance.views import AttendanceRecordCreateView, AttendanceRecordMyListView, AttendanceRecordAllListView, AttendanceRecordUpdateView


urlpatterns = [
    path("records/create/", AttendanceRecordCreateView.as_view(), name="attendance-record-create"),
    path("records/<int:pk>/update/", AttendanceRecordUpdateView.as_view(), name="attendance-record-update"),
    path("records/my_list/", AttendanceRecordMyListView.as_view(), name="attendance-record-my-list"),
    path("records/all_list/", AttendanceRecordAllListView.as_view(), name="attendance-record-all-list"),
]