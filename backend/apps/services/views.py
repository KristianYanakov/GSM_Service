from rest_framework import generics
from .models import Service, ServiceCategory
from .serializers import ServiceSerializer, ServiceCategorySerializer


class ServiceCategoryListView(generics.ListAPIView):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer


class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.filter(is_active=True).select_related("category")
    serializer_class = ServiceSerializer