from django.contrib import admin
from .models.production_plan import ProductionPlan
from .models.production_plan_detail import ProductionPlanDetail


admin.site.register(ProductionPlan)
admin.site.register(ProductionPlanDetail)