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

    def update(self, instance, validated_data):
            details_data = validated_data.pop("details")

            instance.plan_date = validated_data.get("plan_date", instance.plan_date)
            instance.note = validated_data.get("note", instance.note)
            instance.save()

            existing_details = {detail.id: detail for detail in instance.details.all()}

            for detail_data in details_data:
                detail_id = detail_data.get("id")
                if detail_id and detail_id in existing_details:
                    # idが存在する場合は更新
                    for attr, value in detail_data.items():
                        setattr(existing_details[detail_id], attr, value)
                    existing_details[detail_id].save()
                    del existing_details[detail_id]
                else:
                    # idが存在しない場合は新規追加
                    ProductionPlanDetail.objects.create(production_plan=instance, **detail_data)

            # 残ったものは削除されたとみなして削除
            for remaining in existing_details.values():
                remaining.delete()

            return instance