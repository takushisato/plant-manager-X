# Generated by Django 5.1.7 on 2025-03-25 05:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("staff_hub", "0005_permission"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="permission",
            options={
                "verbose_name": "アクセス権限",
                "verbose_name_plural": "アクセス権限",
            },
        ),
        migrations.AlterField(
            model_name="permission",
            name="attendance_access",
            field=models.BooleanField(default=False, verbose_name="勤怠アクセス"),
        ),
        migrations.AlterField(
            model_name="permission",
            name="bug_note_access",
            field=models.BooleanField(default=False, verbose_name="不具合アクセス"),
        ),
        migrations.AlterField(
            model_name="permission",
            name="prod_flow_access",
            field=models.BooleanField(default=False, verbose_name="生産計画アクセス"),
        ),
        migrations.AlterField(
            model_name="permission",
            name="staff_hub_access",
            field=models.BooleanField(default=False, verbose_name="人材管理アクセス"),
        ),
        migrations.AlterField(
            model_name="permission",
            name="trade_flow_access",
            field=models.BooleanField(default=False, verbose_name="受注アクセス"),
        ),
    ]
