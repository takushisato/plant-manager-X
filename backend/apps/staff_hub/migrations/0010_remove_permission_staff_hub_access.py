# Generated by Django 5.1.7 on 2025-04-15 02:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('staff_hub', '0009_permission_can_manage_own_attendance_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='permission',
            name='staff_hub_access',
        ),
    ]
