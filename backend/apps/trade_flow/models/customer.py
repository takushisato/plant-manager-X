from django.db import models
from apps.utility.models import BaseModel


class Customer(BaseModel):
    customer_name = models.CharField("顧客名", max_length=100)
    telephone = models.CharField("電話番号", max_length=100, null=True, blank=True)
    fax = models.CharField("FAX番号", max_length=100, null=True, blank=True)
    email = models.EmailField("メールアドレス", null=True, blank=True)
    postal_code = models.CharField("郵便番号", max_length=100, null=True, blank=True)
    address = models.CharField("住所", max_length=255, null=True, blank=True)
    client_contact = models.CharField("客先担当者名", max_length=100, null=True, blank=True)
    internal_contact = models.CharField("弊社担当者名", max_length=100, null=True, blank=True)
    note = models.TextField("備考",max_length=1000, null=True, blank=True)
    
    class Meta:
        verbose_name = "顧客"
        verbose_name_plural = "顧客"
        db_table = "customers"

    def __str__(self):
        return self.customer_name

