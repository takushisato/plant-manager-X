from rest_framework import serializers
from apps.mail.models.mail_group import MailGroup
from apps.mail.models.mail_group_record import MailGroupRecord
from apps.staff_hub.models.user import User


class MailGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailGroup
        fields = ['group_title', 'note']


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


class MailGroupWithRecordSerializer(serializers.ModelSerializer):
    records = MailGroupRecordSerializer(
        source="mailgrouprecord_set",
        many=True,
        read_only=True
    )

    class Meta:
        model = MailGroup
        fields = ["id", "group_title", "note", "records"]


class MailSendSerializer(serializers.Serializer):
    mail_group_id = serializers.PrimaryKeyRelatedField(queryset=MailGroup.objects.all())
    title = serializers.CharField(max_length=255)
    message = serializers.CharField()
