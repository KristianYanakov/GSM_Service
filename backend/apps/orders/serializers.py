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

    class Meta:
        model = Order
        fields = [
            "id", "full_name", "phone", "email",
            "econt_office", "shipping_address",
            "notes", "items",
        ]

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
        # total_price is recalculated automatically by the signal you already have
        return order


class OrderReadSerializer(serializers.ModelSerializer):
    items = OrderItemReadSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "full_name", "phone", "email",
            "econt_office", "shipping_address", "econt_tracking_number",
            "status", "total_price", "notes", "items", "created_at",
        ]