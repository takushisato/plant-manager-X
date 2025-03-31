from django.urls import path
from apps.prod_flow.views.production_plan_with_details_create_view import ProductionPlanWithDetailsCreateView

urlpatterns = [
    path("plan_with_details/create/", ProductionPlanWithDetailsCreateView.as_view(), name="plan_with_details_create"),
]