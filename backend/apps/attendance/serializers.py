from rest_framework import serializers
from apps.attendance.models.record import Record


class RecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        exclude = ['user', 'work_minutes', 'break_minutes']