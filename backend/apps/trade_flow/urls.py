from django.urls import path
from .views import OrderCreateView, OrderListView, OrderUpdateView, OrderDeleteView

urlpatterns = [
    path("orders/list/", OrderListView.as_view(), name="order-list"),
    path("orders/create/", OrderCreateView.as_view(), name="order-create"),
    path("orders/<int:pk>/update/", OrderUpdateView.as_view(), name="order-update"),
    path("orders/<int:pk>/delete/", OrderDeleteView.as_view(), name="order-delete"),
]
