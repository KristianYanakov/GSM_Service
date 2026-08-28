from django.db import models
from apps.core.models import TimeStampedModel

# Create your models here.

class Category(TimeStampedModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class Product(TimeStampedModel):
    PRODUCT_TYPE_CHOICES = [
        ("phone", "Phone"),
        ("accessory", "Accessory"),
    ]

    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    product_type = models.CharField(max_length=20, choices=PRODUCT_TYPE_CHOICES)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ProductImage(TimeStampedModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=200, blank=True, help_text="Describe the image for accessibility/SEO")
    is_primary = models.BooleanField(default=False, help_text="Main image shown in listings")
    order = models.PositiveIntegerField(default=0, help_text="Controls gallery display order")

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"Image for {self.product.name}"

    def save(self, *args, **kwargs):
        # Ensure only one primary image per product
        if self.is_primary:
            ProductImage.objects.filter(product=self.product, is_primary=True).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)