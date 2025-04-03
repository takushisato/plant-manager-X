from django.urls import path
from apps.bug_note.views import DefectView, DefectDetailView


urlpatterns = [
    path("defects/", DefectView.as_view(), name="defect"),
    path("defects/<int:pk>/", DefectDetailView.as_view(), name="defect-detail"),
]
