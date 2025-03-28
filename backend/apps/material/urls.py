from django.urls import path
from .views import UseStockView, MaterialListView, ReceiveStockView

urlpatterns = [
    path("", MaterialListView.as_view(), name="material-list"),
    path("<int:pk>/use_stock/", UseStockView.as_view(), name="use-stock"),
    path("<int:pk>/receive_stock/", ReceiveStockView.as_view(), name="receive-stock"),
]