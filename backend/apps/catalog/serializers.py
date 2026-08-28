from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "is_primary", "order"]


class ProductListSerializer(serializers.ModelSerializer):
    """Lightweight version for listing many products (e.g. store grid)."""
    category = CategorySerializer(read_only=True)
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "category", "product_type", "price", "stock_quantity", "primary_image"]

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if image:
            return ProductImageSerializer(image, context=self.context).data
        return None


class ProductDetailSerializer(serializers.ModelSerializer):
    """Full version for a single product page — includes full gallery."""
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ["id", "name", "slug", "category", "product_type", "description", "price", "stock_quantity", "images"]

# Splitting list vs. detail serializers is a common DRF pattern — your store grid page doesn't need the full gallery for every product, just one thumbnail, so ProductListSerializer stays light. The product detail page gets the full images array.