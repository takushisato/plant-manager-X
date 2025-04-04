from django.urls import path
from apps.prod_flow.views import ProductionPlanView, ProductionPlanWithRecordView, ProductionPlanWithRecordDetailView


urlpatterns = [
    path("plans/", ProductionPlanView.as_view(), name="production-plan"),
    path("plan_with_records/", ProductionPlanWithRecordView.as_view(), name="production-plan-with-record"),
    path("plan_with_records/<int:pk>/", ProductionPlanWithRecordDetailView.as_view(), name="production-plan-with-record-detail"),
]