from django.urls import path
from apps.bug_note.views import DefectCreateView, DefectListView, DefectDetailView


urlpatterns = [
    path("defects/create/", DefectCreateView.as_view(), name="defect-create"),
    path("defects/list/", DefectListView.as_view(), name="defect-list"),
    path("defects/<int:pk>/", DefectDetailView.as_view(), name="defect-detail"),
]
