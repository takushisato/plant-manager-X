from django.urls import path
from .views import OrderView, OrderUpdateView, OrderDeleteView

urlpatterns = [
    path("orders/", OrderView.as_view(), name="order"),
    # path("orders/create/", OrderCreateView.as_view(), name="order-create"),
    path("orders/<int:pk>/update/", OrderUpdateView.as_view(), name="order-update"),
    path("orders/<int:pk>/delete/", OrderDeleteView.as_view(), name="order-delete"),
]
