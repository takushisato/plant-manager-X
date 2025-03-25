from django.db import models
from apps.utility.models import BaseModel
from .customer import Customer


class Order(BaseModel):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, verbose_name="顧客")
    order_number = models.CharField("注文番号", max_length=100)
    order_date = models.DateField("注文日")
    product_name = models.CharField("商品名", max_length=100)
    quantity = models.IntegerField("数量")
    price = models.IntegerField("見積もり価格")
    deadline = models.DateField("納期")
    note = models.TextField("備考", max_length=1000, null=True, blank=True)

    class Meta:
        verbose_name = "受注"
        verbose_name_plural = "受注"
        db_table = "orders"

    def __str__(self):
        return self.product_name
