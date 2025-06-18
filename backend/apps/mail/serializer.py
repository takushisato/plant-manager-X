from rest_framework import serializers
from apps.mail.models.mail_group import MailGroup
from apps.mail.models.mail_group_record import MailGroupRecord
from apps.mail.models.mail_history import MailHistory
from apps.staff_hub.models.user import User


class MailGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailGroup
        fields = ['group_title', 'note']

    def create(self, validated_data):
        create_user = self.context["create_user"]
        return MailGroup.objects.create(**validated_data, create_user=create_user)


class MailGroupRecordBulkCreateSerializer(serializers.Serializer):
    mail_group_record = serializers.PrimaryKeyRelatedField(queryset=MailGroup.objects.all())
    recipient_users = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all()
    )

class MailGroupRecordSerializer(serializers.ModelSerializer):
    recipient_user_name = serializers.CharField(source="recipient_user.name", read_only=True)

    class Meta:
        model = MailGroupRecord
        fields = ["id", "recipient_user", "recipient_user_name"]

    def create(self, validated_data):
        records_data = validated_data.pop("records")
        create_user = self.context["create_user"]
        mail_group = MailGroup.objects.create(**validated_data, create_user=create_user)

        for record_data in records_data:
            MailGroupRecord.objects.create(mail_group=mail_group, **record_data)

        return mail_group


class MailHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MailHistory
        fields = ["id", "mail_group", "sent_at", "title", "message"]


class MailGroupWithRecordSerializer(serializers.ModelSerializer):
    history = MailHistorySerializer(
        source="mailhistory_set",
        many=True,
        read_only=True
    )
    records = MailGroupRecordSerializer(
        source="mailgrouprecord_set",
        many=True,
        read_only=True
    )

    class Meta:
        model = MailGroup
        fields = ["id", "group_title", "note", "records", "history"]


class MailSendSerializer(serializers.Serializer):
    mail_group_id = serializers.PrimaryKeyRelatedField(queryset=MailGroup.objects.all())
    title = serializers.CharField(max_length=255)
    message = serializers.CharField()
