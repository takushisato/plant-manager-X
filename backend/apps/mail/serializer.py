from rest_framework import serializers
from apps.mail.models.mail_group import MailGroup


class MailGroupCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MailGroup
        fields = ['group_title', 'note']