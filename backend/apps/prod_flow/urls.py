from django.urls import path
from apps.prod_flow.views import PlanView, PlanWithRecordView, PlanWithRecordDetailView


urlpatterns = [
    path("plans/", PlanView.as_view(), name="plan"),
    path("plan_with_records/", PlanWithRecordView.as_view(), name="plan-with-record"),
    path(
        "plan_with_records/<int:pk>/",
        PlanWithRecordDetailView.as_view(),
        name="plan-with-record-detail",
    ),
]
