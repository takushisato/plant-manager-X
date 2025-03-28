from rest_framework import serializers
from apps.mail.models.mail_group import MailGroup
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