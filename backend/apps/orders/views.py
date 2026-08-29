from rest_framework import generics
from .models import Order
from .serializers import OrderCreateSerializer, OrderReadSerializer


class OrderCreateView(generics.CreateAPIView):
    """Public endpoint — customer submits an order from the checkout page."""
    queryset = Order.objects.all()
    serializer_class = OrderCreateSerializer


class OrderDetailView(generics.RetrieveAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderReadSerializer
    lookup_field = "order_number"
    lookup_url_kwarg = "order_number"