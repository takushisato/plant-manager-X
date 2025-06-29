from rest_framework import serializers
from apps.attendance.models.work_record import WorkRecord
from apps.staff_hub.serializers import UserSerializer


class WorkRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkRecord
        exclude = ["user", "work_minutes", "break_minutes"]


class WorkRecordListSerializer(serializers.Serializer):
    user = serializers.SerializerMethodField()
    total_worked_date = serializers.IntegerField()

    def get_user(self, obj):
        return {"id": obj["user__id"], "name": obj["user__name"]}


class WorkRecordModelSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = WorkRecord
        fields = [
            "id",
            "date",
            "start_time",
            "end_time",
            "user",
            "work_minutes",
            "break_minutes",
            "work_status",
            "note",
        ]

    def get_user(self, obj):
        return {"id": obj.user.id, "name": obj.user.name}


class WorkRecordUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkRecord
        fields = [
            "work_pattern",
            "date",
            "start_time",
            "end_time",
            "work_status",
            "note",
        ]
