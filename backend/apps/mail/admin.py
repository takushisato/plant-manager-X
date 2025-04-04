from django.contrib import admin
from .models.mail_group import MailGroup
from .models.mail_group_record import MailGroupRecord
from .models.mail_history import MailHistory


admin.site.register(MailGroup)
admin.site.register(MailGroupRecord)
admin.site.register(MailHistory)
