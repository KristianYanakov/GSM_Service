from django.db import models
from apps.core.models import TimeStampedModel


class ServiceCategory(TimeStampedModel):
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Service Categories"

    def __str__(self):
        return self.name


class Service(TimeStampedModel):
    category = models.ForeignKey(ServiceCategory, on_delete=models.PROTECT, related_name="services")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price_from = models.DecimalField(max_digits=10, decimal_places=2, help_text="Starting price")
    turnaround_time = models.CharField(max_length=100, blank=True, help_text="e.g. '30 min', '1-2 days'")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name