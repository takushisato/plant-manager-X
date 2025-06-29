from django.contrib import admin
from .models.production_plan import ProductionPlan
from .models.production_plan_record import ProductionPlanRecord


admin.site.register(ProductionPlan)
admin.site.register(ProductionPlanRecord)
