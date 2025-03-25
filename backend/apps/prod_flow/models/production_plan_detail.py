from django.db import models
from apps.utility.models import BaseModel
from apps.prod_flow.models.production_plan import ProductionPlan


class ProductionPlanDetail(BaseModel):
    production_plan = models.ForeignKey(ProductionPlan, on_delete=models.CASCADE, verbose_name="生産計画")
    title = models.CharField("タイトル", max_length=255)
    planned_start_date = models.DateField("計画開始日")
    planned_end_date = models.DateField("計画終了日")
    actual_start_date = models.DateField("実績開始日", null=True, blank=True)
    actual_end_date = models.DateField("実績終了日", null=True, blank=True)
    sort = models.IntegerField("並び順", default=0)
    note = models.CharField("備考", max_length=1000, null=True, blank=True)

    class Meta:
        verbose_name = '生産計画詳細'
        verbose_name_plural = '生産計画詳細'
        db_table = 'production_plan_details'
    
    def __str__(self):
        return f"{self.production_plan.organization.organization_name} - {self.title}"
