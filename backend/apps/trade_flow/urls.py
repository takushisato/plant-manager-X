from django.urls import path
from .views import OrderView, OrderDetailView, CustomerView


urlpatterns = [
    path("orders/", OrderView.as_view(), name="order"),
    path("orders/<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("customers/", CustomerView.as_view(), name="customer"),
]
