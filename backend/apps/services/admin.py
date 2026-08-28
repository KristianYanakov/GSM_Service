from django.contrib import admin
from .models import ServiceCategory, Service


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ["name"]
    search_fields = ["name"]


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price_from", "turnaround_time", "is_active"]
    list_filter = ["category", "is_active"]
    search_fields = ["name", "description"]
    list_editable = ["is_active"]