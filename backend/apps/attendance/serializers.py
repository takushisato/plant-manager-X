from rest_framework import serializers
from apps.attendance.models.record import Record


class RecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        exclude = ['user', 'work_minutes', 'break_minutes']

class RecordListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = [
            "id", "work_date", "clock_in_time", "clock_out_time",
            "work_minutes", "break_minutes", "work_status", "note"
        ]