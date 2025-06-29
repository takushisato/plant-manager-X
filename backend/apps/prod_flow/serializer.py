from rest_framework import serializers
from apps.prod_flow.models.production_plan import ProductionPlan
from apps.prod_flow.models.production_plan_record import ProductionPlanRecord


class PlanDetailNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionPlanRecord
        exclude = ["production_plan"]


class PlanWithRecordSerializer(serializers.ModelSerializer):
    records = PlanDetailNestedSerializer(many=True)

    class Meta:
        model = ProductionPlan
        fields = ["id", "organization", "plan_date", "note", "records"]

    def create(self, validated_data):
        records_data = validated_data.pop("records")
        production_plan = ProductionPlan.objects.create(**validated_data)

        records_instances = [
            ProductionPlanRecord(production_plan=production_plan, **record)
            for record in records_data
        ]
        ProductionPlanRecord.objects.bulk_create(records_instances)

        return production_plan


class updatePlanWithRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionPlan
        fields = [
            "defect_detail",
            "occurred_at",
            "submission",
            "order",
            "submission_deadline",
            "title",
        ]

    def update(self, instance, validated_data):
        instance.defect_detail = validated_data.get(
            "defect_detail", instance.defect_detail
        )
        instance.occurred_at = validated_data.get("occurred_at", instance.occurred_at)
        instance.submission = validated_data.get("submission", instance.submission)
        instance.order = validated_data.get("order", instance.order)
        instance.submission_deadline = validated_data.get(
            "submission_deadline", instance.submission_deadline
        )
        instance.title = validated_data.get("title", instance.title)
        instance.save()

        return instance
