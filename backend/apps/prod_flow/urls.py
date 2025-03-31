from django.urls import path
from apps.prod_flow.views.production_plan_with_details_create_view import ProductionPlanWithDetailsCreateView
from apps.prod_flow.views.production_plan_list_view import ProductionPlanListView
from apps.prod_flow.views.production_plan_with_details_update_view import ProductionPlanWithDetailsUpdateView


urlpatterns = [
    path("plans/", ProductionPlanListView.as_view(), name="plan-list"),
    path("plan_with_details/create/", ProductionPlanWithDetailsCreateView.as_view(), name="plan_with_details_create"),
    path("plans/<int:pk>/update/", ProductionPlanWithDetailsUpdateView.as_view(), name="production-plan-update"),
]