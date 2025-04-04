from rest_framework import serializers
from apps.attendance.models.work_record import WorkRecord


class WorkRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkRecord
        exclude = ['user', 'work_minutes', 'break_minutes']


class WorkRecordListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkRecord
        fields = [
            "id", "work_date", "clock_in_time", "clock_out_time",
            "work_minutes", "break_minutes", "work_status", "note"
        ]


class WorkRecordUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkRecord
        fields = [
            "work_pattern", "work_date", "clock_in_time", "clock_out_time",
            "work_status", "note"
        ]