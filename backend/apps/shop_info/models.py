from django.db import models
from apps.core.models import TimeStampedModel


class ShopLocation(TimeStampedModel):
    name = models.CharField(max_length=150, default="Main Store")
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    phone = models.CharField(max_length=30, blank=True)

    workdays_text = models.CharField(max_length=100, blank=True, help_text="e.g. 'Mon–Fri'")
    working_hours_weekdays = models.CharField(max_length=100, blank=True, help_text="e.g. '09:00–18:00'")
    working_hours_weekends = models.CharField(max_length=100, blank=True, help_text="e.g. '10:00–14:00' or 'Closed'")

    def __str__(self):
        return self.name


class GalleryImage(TimeStampedModel):
    image = models.ImageField(upload_to="gallery/")
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.caption or f"Gallery image #{self.pk}"

class ShopInfo(TimeStampedModel):
    shop_name = models.CharField(max_length=150)
    about_text = models.TextField(blank=True, help_text="Main 'About Us' description")
    staff_description = models.TextField(blank=True, help_text="General blurb about the team")
    facebook_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)

    class Meta:
        verbose_name = "Shop Info"
        verbose_name_plural = "Shop Info"

    def __str__(self):
        return self.shop_name

    def save(self, *args, **kwargs):
        self.pk = 1  # enforce singleton
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass  # prevent deletion