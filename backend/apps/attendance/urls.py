from django.urls import path
from apps.attendance.views import AttendanceRecordView, AttendanceRecordMyListView, AttendanceRecordAllListView, AttendanceRecordDetailView


urlpatterns = [
    path("records/", AttendanceRecordView.as_view(), name="attendance-record"),
    path("records/<int:pk>/", AttendanceRecordDetailView.as_view(), name="attendance-record-detail"),
    path("records/my_list/", AttendanceRecordMyListView.as_view(), name="attendance-record-my-list"),
    path("records/all_list/", AttendanceRecordAllListView.as_view(), name="attendance-record-all-list"),
]