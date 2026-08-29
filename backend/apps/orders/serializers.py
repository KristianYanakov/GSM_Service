import re
from rest_framework import serializers
from .models import Order, OrderItem
from apps.catalog.models import Product


class OrderItemWriteSerializer(serializers.Serializer):
    """Used when a customer submits a new order — just product id + quantity."""
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemReadSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price_at_purchase"]


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemWriteSerializer(many=True, write_only=True)

    # Honeypot field — real users never see or fill this in.
    # Named to look tempting to a bot filling forms generically.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "order_number", "full_name", "phone", "email",
            "econt_office", "shipping_address",
            "notes", "items", "website",
        ]
        read_only_fields = ["id", "order_number"]

    def validate_website(self, value):
        if value:
            # Silently-looking generic error — don't reveal this is a honeypot check.
            raise serializers.ValidationError("Unable to process request.")
        return value

    def validate_phone(self, value):
        if not re.match(r'^[0-9+\s\-]{6,20}$', value):
            raise serializers.ValidationError("Enter a valid phone number.")
        return value

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order must contain at least one item.")
        return items

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)

        for item in items_data:
            try:
                product = Product.objects.get(pk=item["product_id"], is_active=True)
            except Product.DoesNotExist:
                order.delete()
                raise serializers.ValidationError(f"Product {item['product_id']} not found or unavailable.")

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
            )
        return order


class OrderReadSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_number", "full_name", "phone", "email",
            "econt_office", "shipping_address", "econt_tracking_number",
            "status", "total_price", "notes", "items", "created_at",
        ]