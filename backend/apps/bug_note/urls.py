from django.urls import path
from apps.bug_note.views import DefectView, DefectDetailView, DefectUpdateView, DefectDeleteView


urlpatterns = [
    path("defects/", DefectView.as_view(), name="defect"),
    path("defects/<int:pk>/", DefectDetailView.as_view(), name="defect-detail"),
    path("defects/<int:pk>/update/", DefectUpdateView.as_view(), name="defect-update"),
    path('defects/<int:pk>/delete/', DefectDeleteView.as_view(), name='defect-delete'),
]
