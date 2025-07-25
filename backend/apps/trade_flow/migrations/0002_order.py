# Generated by Django 5.1.7 on 2025-03-25 10:06

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("trade_flow", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="Order",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created_at",
                    models.DateTimeField(
                        default=django.utils.timezone.now, verbose_name="作成日時"
                    ),
                ),
                (
                    "updated_at",
                    models.DateTimeField(
                        auto_now=True, null=True, verbose_name="更新日時"
                    ),
                ),
                (
                    "deleted_at",
                    models.DateTimeField(
                        blank=True, null=True, verbose_name="削除日時"
                    ),
                ),
                (
                    "order_number",
                    models.CharField(max_length=100, verbose_name="注文番号"),
                ),
                ("order_date", models.DateField(verbose_name="注文日")),
                (
                    "product_name",
                    models.CharField(max_length=100, verbose_name="商品名"),
                ),
                ("quantity", models.IntegerField(verbose_name="数量")),
                ("price", models.IntegerField(verbose_name="見積もり価格")),
                ("deadline", models.DateField(verbose_name="納期")),
                (
                    "note",
                    models.TextField(
                        blank=True, max_length=1000, null=True, verbose_name="備考"
                    ),
                ),
                (
                    "customer",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="trade_flow.customer",
                        verbose_name="顧客",
                    ),
                ),
            ],
            options={
                "verbose_name": "受注",
                "verbose_name_plural": "受注",
                "db_table": "orders",
            },
        ),
    ]
