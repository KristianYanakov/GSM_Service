import uuid
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Sum, F
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import receiver
from apps.core.models import TimeStampedModel
from apps.catalog.models import Product


class Order(TimeStampedModel):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
    ]

    order_number = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    email = models.EmailField(blank=True)

    econt_office = models.CharField(max_length=200, blank=True)
    shipping_address = models.TextField(blank=True)
    econt_tracking_number = models.CharField(max_length=50, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0, editable=False)
    notes = models.TextField(blank=True)

    def clean(self):
        """
        Проверява в Django Admin дали има достатъчно наличност, ако отказана ('cancelled')
        поръчка се връща обратно към активен статус.
        """
        super().clean()
        if self.pk:
            old_status = Order.objects.filter(pk=self.pk).values_list("status", flat=True).first()
            if old_status == "cancelled" and self.status != "cancelled":
                for item in self.items.select_related("product").all():
                    if item.product.stock_quantity < item.quantity:
                        raise ValidationError(
                            {
                                "status": (
                                    f"Недостатъчна наличност за '{item.product.name}' "
                                    f"(налични: {item.product.stock_quantity}, нужни: {item.quantity})."
                                )
                            }
                        )

    def __str__(self):
        return f"Order #{self.pk} - {self.full_name}"


class OrderItem(TimeStampedModel):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2, editable=False)

    def save(self, *args, **kwargs):
        if not self.price_at_purchase:
            self.price_at_purchase = self.product.price
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"


# --- СИГНАЛИ ЗА НАЛИЧНОСТИ (STOCK QUANTITY) И TOTAL PRICE ---

@receiver(pre_save, sender=Order)
def sync_stock_on_order_status_change(sender, instance, **kwargs):
    """
    Връща артикулите в наличност при смяна на статуса към 'cancelled'
    и ги изважда отново, ако поръчката се върне от 'cancelled' към активен статус.
    """
    if not instance.pk:
        return

    # Пропускаме проверката, когато update_order_total обновява само total_price
    update_fields = kwargs.get("update_fields")
    if update_fields is not None and "status" not in update_fields:
        return

    old_status = Order.objects.filter(pk=instance.pk).values_list("status", flat=True).first()
    if not old_status or old_status == instance.status:
        return

    # 1. Активна поръчка -> Отказана ('cancelled'): връщаме бройките в склада
    if old_status != "cancelled" and instance.status == "cancelled":
        for item in instance.items.all():
            Product.objects.filter(pk=item.product_id).update(
                stock_quantity=F("stock_quantity") + item.quantity
            )

    # 2. Отказана ('cancelled') -> Активна поръчка: изваждаме бройките от склада
    elif old_status == "cancelled" and instance.status != "cancelled":
        for item in instance.items.all():
            Product.objects.filter(pk=item.product_id).update(
                stock_quantity=F("stock_quantity") - item.quantity
            )


@receiver(pre_save, sender=OrderItem)
def sync_stock_on_item_update(sender, instance, **kwargs):
    """
    Коригира наличността, ако количеството или продуктът на съществуващ OrderItem
    бъдат променени през Django Admin.
    """
    if not instance.pk:
        return

    old_item = OrderItem.objects.select_related("order").filter(pk=instance.pk).first()
    if not old_item or old_item.order.status == "cancelled":
        return

    if old_item.product_id != instance.product_id:
        # Ако продуктът е сменен с друг, връщаме стария и изваждаме новия
        Product.objects.filter(pk=old_item.product_id).update(
            stock_quantity=F("stock_quantity") + old_item.quantity
        )
        Product.objects.filter(pk=instance.product_id).update(
            stock_quantity=F("stock_quantity") - instance.quantity
        )
    elif old_item.quantity != instance.quantity:
        # Ако само количеството е променено
        diff = instance.quantity - old_item.quantity
        Product.objects.filter(pk=instance.product_id).update(
            stock_quantity=F("stock_quantity") - diff
        )


@receiver(post_save, sender=OrderItem)
def deduct_stock_on_item_create(sender, instance, created, **kwargs):
    """Изважда количеството от склада при добавяне на нов артикул към поръчка."""
    if created and instance.order.status != "cancelled":
        Product.objects.filter(pk=instance.product_id).update(
            stock_quantity=F("stock_quantity") - instance.quantity
        )


@receiver(post_delete, sender=OrderItem)
def restore_stock_on_item_delete(sender, instance, **kwargs):
    """Връща количеството в склада при изтриване на артикул (или цяла активна поръчка)."""
    if instance.order.status != "cancelled":
        Product.objects.filter(pk=instance.product_id).update(
            stock_quantity=F("stock_quantity") + instance.quantity
        )


@receiver([post_save, post_delete], sender=OrderItem)
def update_order_total(sender, instance, **kwargs):
    """Автоматично преизчислява общата сума на поръчката."""
    order = instance.order
    if not Order.objects.filter(pk=order.pk).exists():
        return  # Защита при изтриване на цялата поръчка (CASCADE)

    total = order.items.aggregate(
        total=Sum(F("quantity") * F("price_at_purchase"))
    )["total"] or 0
    order.total_price = total
    order.save(update_fields=["total_price"])