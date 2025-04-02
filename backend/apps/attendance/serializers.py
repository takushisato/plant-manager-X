from rest_framework import serializers
from apps.attendance.models.attendance_record import AttendanceRecord


class AttendanceRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceRecord
        exclude = ['user', 'work_minutes', 'break_minutes']