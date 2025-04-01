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
