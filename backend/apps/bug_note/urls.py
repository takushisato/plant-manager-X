from django.urls import path
from apps.bug_note.views import DefectCreateView


urlpatterns = [
    path("defects/create/", DefectCreateView.as_view(), name="defect-create"),
]
