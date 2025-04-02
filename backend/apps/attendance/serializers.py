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


class RecordUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = [
            "work_pattern", "work_date", "clock_in_time", "clock_out_time",
            "work_status", "note"
        ]

    def validate(self, attrs):
        clock_in = attrs.get("clock_in_time", self.instance.clock_in_time)
        clock_out = attrs.get("clock_out_time", self.instance.clock_out_time)

        if clock_out <= clock_in:
            raise serializers.ValidationError("退勤時間は出勤時間より後である必要があります。")

        return attrs