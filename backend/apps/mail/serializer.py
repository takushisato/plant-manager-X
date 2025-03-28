from rest_framework import serializers
from apps.mail.models.mail_group import MailGroup
from apps.mail.models.mail_group_detail import MailGroupDetail
from apps.staff_hub.models import User


class MailGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailGroup
        fields = ['group_title', 'note']


class MailGroupDetailBulkCreateSerializer(serializers.Serializer):
    mail_group_detail = serializers.PrimaryKeyRelatedField(queryset=MailGroup.objects.all())
    recipient_users = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all()
    )

class MailGroupDetailSerializer(serializers.ModelSerializer):
    recipient_user_name = serializers.CharField(source="recipient_user.name", read_only=True)

    class Meta:
        model = MailGroupDetail
        fields = ["id", "recipient_user", "recipient_user_name"]


class MailGroupWithDetailsSerializer(serializers.ModelSerializer):
    details = MailGroupDetailSerializer(
        source="mailgroupdetail_set",
        many=True,
        read_only=True
    )

    class Meta:
        model = MailGroup
        fields = ["id", "group_title", "note", "details"]