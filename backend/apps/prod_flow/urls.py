from django.urls import path
from apps.prod_flow.views import ProductionPlanView, ProductionPlanWithRecordView, ProductionPlanWithDetailsUpdateView, ProductionPlanDeleteView


urlpatterns = [
    path("plans/", ProductionPlanView.as_view(), name="production-plan"),
    path("plan_with_records/", ProductionPlanWithRecordView.as_view(), name="production-plan-with-record"),
    path("plans/<int:pk>/update/", ProductionPlanWithDetailsUpdateView.as_view(), name="production-plan-update"),
    path('plans/<int:pk>/delete/', ProductionPlanDeleteView.as_view(), name='production-plan-delete'),
]