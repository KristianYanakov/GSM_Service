from rest_framework import generics
from .models import ShopLocation, GalleryImage, ShopInfo
from .serializers import ShopLocationSerializer, GalleryImageSerializer, ShopInfoSerializer


class ShopLocationListView(generics.ListAPIView):
    queryset = ShopLocation.objects.all()
    serializer_class = ShopLocationSerializer


class GalleryImageListView(generics.ListAPIView):
    queryset = GalleryImage.objects.all().order_by("order")
    serializer_class = GalleryImageSerializer


class ShopInfoView(generics.RetrieveAPIView):
    """Singleton — always returns the one ShopInfo row, no pk needed in the URL."""
    serializer_class = ShopInfoSerializer

    def get_object(self):
        return ShopInfo.objects.first()