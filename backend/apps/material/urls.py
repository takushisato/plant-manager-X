from django.urls import path
from .views import UseStockView, MaterialView, ReceiveStockView

urlpatterns = [
    path("", MaterialView.as_view(), name="material"),
    path("use_stock/<int:pk>/", UseStockView.as_view(), name="use-stock"),
    path("receive_stock/<int:pk>/", ReceiveStockView.as_view(), name="receive-stock"),
]
