from django.db import models
from apps.utility.models import BaseModel
from apps.staff_hub.models.organization import Organization


class ProductionPlan(BaseModel):
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, verbose_name="組織"
    )
    plan_date = models.DateField("計画日")
    note = models.CharField("備考", max_length=1000, null=True, blank=True)

    class Meta:
        verbose_name = "生産計画"
        verbose_name_plural = "生産計画"
        db_table = "production_plans"

    def __str__(self):
        return f"{self.organization.organization_name} - {self.plan_date}"
