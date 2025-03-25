# Generated by Django 5.1.7 on 2025-03-25 09:03

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prod_flow', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductionPlanDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now, verbose_name='作成日時')),
                ('updated_at', models.DateTimeField(auto_now=True, null=True, verbose_name='更新日時')),
                ('deleted_at', models.DateTimeField(blank=True, null=True, verbose_name='削除日時')),
                ('title', models.CharField(max_length=255, verbose_name='タイトル')),
                ('planned_start_date', models.DateField(verbose_name='計画開始日')),
                ('planned_end_date', models.DateField(verbose_name='計画終了日')),
                ('actual_start_date', models.DateField(blank=True, null=True, verbose_name='実績開始日')),
                ('actual_end_date', models.DateField(blank=True, null=True, verbose_name='実績終了日')),
                ('sort', models.IntegerField(default=0, verbose_name='並び順')),
                ('note', models.CharField(blank=True, max_length=1000, null=True, verbose_name='備考')),
                ('production_plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='prod_flow.productionplan', verbose_name='生産計画')),
            ],
            options={
                'verbose_name': '生産計画詳細',
                'verbose_name_plural': '生産計画詳細',
                'db_table': 'production_plan_details',
            },
        ),
    ]
