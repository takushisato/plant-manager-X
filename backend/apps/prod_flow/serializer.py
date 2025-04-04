from rest_framework import serializers
from apps.prod_flow.models.production_plan import ProductionPlan
from apps.prod_flow.models.production_plan_record import ProductionPlanRecord


class PlanDetailNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductionPlanRecord
        exclude = ['production_plan']


class PlanWithRecordSerializer(serializers.ModelSerializer):
    records = PlanDetailNestedSerializer(many=True)

    class Meta:
        model = ProductionPlan
        fields = ['id', 'organization', 'plan_date', 'note', 'records']

    def create(self, validated_data):
        records_data = validated_data.pop('records')
        production_plan = ProductionPlan.objects.create(**validated_data)

        records_instances = [
            ProductionPlanRecord(production_plan=production_plan, **record)
            for record in records_data
        ]
        ProductionPlanRecord.objects.bulk_create(records_instances)

        return production_plan

    def update(self, instance, validated_data):
        records_data = validated_data.pop("records")

        instance.plan_date = validated_data.get("plan_date", instance.plan_date)
        instance.note = validated_data.get("note", instance.note)
        instance.save()

        existing_records = {record.id: record for record in instance.records.all()}

        for record_data in records_data:
            record_id = record_data.get("id")
            if record_id and record_id in existing_records:
                # idが存在する場合は更新
                for attr, value in record_data.items():
                    setattr(existing_records[record_id], attr, value)
                existing_records[record_id].save()
                del existing_records[record_id]
            else:
                # idが存在しない場合は新規追加
                ProductionPlanRecord.objects.create(production_plan=instance, **record_data)

        # 残ったものは削除されたとみなして削除
        for remaining in existing_records.values():
            remaining.delete()

        return instance