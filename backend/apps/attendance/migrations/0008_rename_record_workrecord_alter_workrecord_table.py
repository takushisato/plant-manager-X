# Generated by Django 5.1.7 on 2025-04-04 08:41

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("attendance", "0007_rename_attendancerecord_record"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RenameModel(
            old_name="Record",
            new_name="WorkRecord",
        ),
        migrations.AlterModelTable(
            name="workrecord",
            table="work_records",
        ),
    ]
