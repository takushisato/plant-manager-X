from rest_framework import serializers
from apps.prod_flow.models.production_plan import ProductionPlan
from apps.prod_flow.models.production_plan_detail import ProductionPlanDetail


class ProductionPlanDetailNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionPlanDetail
        exclude = ['production_plan']


class ProductionPlanWithDetailsSerializer(serializers.ModelSerializer):
    details = ProductionPlanDetailNestedSerializer(many=True)

    class Meta:
        model = ProductionPlan
        fields = ['id', 'organization', 'plan_date', 'note', 'details']

    def create(self, validated_data):
        details_data = validated_data.pop('details')
        production_plan = ProductionPlan.objects.create(**validated_data)

        details_instances = [
            ProductionPlanDetail(production_plan=production_plan, **detail)
            for detail in details_data
        ]
        ProductionPlanDetail.objects.bulk_create(details_instances)

        return production_plan
