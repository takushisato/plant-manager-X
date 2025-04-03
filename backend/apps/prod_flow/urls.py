from django.urls import path
from apps.prod_flow.views import ProductionPlanView, ProductionPlanWithDetailsCreateView, ProductionPlanWithDetailsUpdateView, ProductionPlanDeleteView


urlpatterns = [
    path("plans/", ProductionPlanView.as_view(), name="plan"),
    path("plan_with_details/create/", ProductionPlanWithDetailsCreateView.as_view(), name="plan_with_details_create"),
    path("plans/<int:pk>/update/", ProductionPlanWithDetailsUpdateView.as_view(), name="production-plan-update"),
    path('plans/<int:pk>/delete/', ProductionPlanDeleteView.as_view(), name='production-plan-delete'),
]