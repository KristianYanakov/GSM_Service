from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ["product", "quantity"]  # price_at_purchase is editable=False, no need to list it


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["id", "order_number", "full_name", "phone", "status", "total_price", "econt_tracking_number", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["full_name", "phone", "email", "econt_tracking_number"]
    inlines = [OrderItemInline]
    list_editable = ["status"]