from django.contrib import admin
from .models.mail_group import MailGroup
from .models.mail_group_detail import MailGroupDetail
from .models.mail_template import MailTemplate


admin.site.register(MailGroup)
admin.site.register(MailGroupDetail)
admin.site.register(MailTemplate)
