from django.urls import path
from .views import UseStockView

urlpatterns = [
    path("<int:pk>/use_stock/", UseStockView.as_view(), name="use-stock"),
]