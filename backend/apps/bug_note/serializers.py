from rest_framework import serializers
from apps.bug_note.models.defect import Defect


class DefectCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Defect
        fields = [
            "order",
            "occurred_at",
            "title",
            "defect_detail",
            "submission",
            "submission_deadline",
        ]

class DefectListSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source="order.order_number", read_only=True)
    create_user_name = serializers.CharField(source="create_user.name", read_only=True)

    class Meta:
        model = Defect
        fields = [
            "id", "create_user_name", "order_number",
            "occurred_at", "title"
        ]

class DefectDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Defect
        fields = "__all__"

class DefectUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Defect
        fields = [
            "order", "occurred_at", "title", "defect_detail",
            "submission", "submission_deadline"
        ]