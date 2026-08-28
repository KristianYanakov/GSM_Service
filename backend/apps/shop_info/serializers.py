from rest_framework import serializers
from .models import ShopLocation, GalleryImage, ShopInfo


class ShopLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopLocation
        fields = [
            "id", "name", "address", "latitude", "longitude", "phone",
            "workdays_text", "working_hours_weekdays", "working_hours_weekends",
        ]


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryImage
        fields = ["id", "image", "caption", "order"]


class ShopInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopInfo
        fields = ["shop_name", "about_text", "staff_description", "facebook_url", "instagram_url"]