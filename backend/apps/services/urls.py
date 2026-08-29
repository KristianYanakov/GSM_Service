from django.urls import path
from .views import ServiceCategoryListView, ServiceListView

urlpatterns = [
    path("categories/", ServiceCategoryListView.as_view(), name="service-category-list"),
    path("", ServiceListView.as_view(), name="service-list"),
]