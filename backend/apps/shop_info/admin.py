from django.contrib import admin
from .models import ShopLocation, GalleryImage, ShopInfo


@admin.register(ShopLocation)
class ShopLocationAdmin(admin.ModelAdmin):
    list_display = ["name", "address", "phone"]


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ["caption", "order", "created_at"]
    list_editable = ["order"]
    ordering = ["order"]


@admin.register(ShopInfo)
class ShopInfoAdmin(admin.ModelAdmin):
    list_display = ["shop_name"]

    def has_add_permission(self, request):
        # Prevent creating more than one ShopInfo row
        return not ShopInfo.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False