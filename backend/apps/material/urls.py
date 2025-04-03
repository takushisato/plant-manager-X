from django.urls import path
from .views import UseStockView, MaterialView, ReceiveStockView

urlpatterns = [
    path("", MaterialView.as_view(), name="material"),
    path("<int:pk>/use_stock/", UseStockView.as_view(), name="use-stock"),
    path("<int:pk>/receive_stock/", ReceiveStockView.as_view(), name="receive-stock"),
]