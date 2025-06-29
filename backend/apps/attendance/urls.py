from django.urls import path
from apps.attendance.views import (
    RecordView,
    RecordDetailView,
    RecordMyListView,
    RecordAllListView,
)


urlpatterns = [
    path("records/", RecordView.as_view(), name="record"),
    path("records/<int:pk>/", RecordDetailView.as_view(), name="record-detail"),
    path("records/my_list/", RecordMyListView.as_view(), name="record-my-list"),
    path("records/all_list/", RecordAllListView.as_view(), name="record-all-list"),
]
