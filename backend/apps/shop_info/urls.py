from django.urls import path
from .views import ShopLocationListView, GalleryImageListView, ShopInfoView

urlpatterns = [
    path("locations/", ShopLocationListView.as_view(), name="location-list"),
    path("gallery/", GalleryImageListView.as_view(), name="gallery-list"),
    path("info/", ShopInfoView.as_view(), name="shop-info"),
]