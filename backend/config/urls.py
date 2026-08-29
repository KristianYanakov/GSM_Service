"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/catalog/", include("apps.catalog.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/services/", include("apps.services.urls")),
    path("api/shop-info/", include("apps.shop_info.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Test Endpoints - Working

# http://127.0.0.1:8000/api/catalog/categories/
# http://127.0.0.1:8000/api/catalog/products/
# http://127.0.0.1:8000/api/catalog/products/?category=phones
# http://127.0.0.1:8000/api/catalog/products/?type=phone
# http://127.0.0.1:8000/api/catalog/products/your-product-slug/
# http://127.0.0.1:8000/api/catalog/products/?type=phone
# http://127.0.0.1:8000/api/catalog/products/?type=accessory
# http://127.0.0.1:8000/api/catalog/products/?category=phones&type=phone
# http://127.0.0.1:8000/api/catalog/products/does-not-exist/

# http://127.0.0.1:8000/api/services/categories/
# http://127.0.0.1:8000/api/services/


# http://127.0.0.1:8000/api/shop-info/locations/
# http://127.0.0.1:8000/api/shop-info/gallery/
# http://127.0.0.1:8000/api/shop-info/info/

# http://127.0.0.1:8000/api/orders/52785636-a8f8-4f3d-80f5-0afd670579b3/

# PowerShell Query
# PS C:\Users\Kris> $body = @{
# >>     full_name = "Test Customer"
# >>     phone = "0888123456"
# >>     email = "test@example.com"
# >>     econt_office = "Sofia Office 5"
# >>     shipping_address = ""
# >>     notes = "Test order"
# >>     items = @(
# >>         @{ product_id = 1; quantity = 2 }
# >>     )
# >> } | ConvertTo-Json
# >>
# >> Invoke-RestMethod -Uri "http://127.0.0.1:8000/api/orders/" -Method Post -Body $body -ContentType "application/json"
#
#
# id               : 6
# order_number     : 52785636-a8f8-4f3d-80f5-0afd670579b3
# full_name        : Test Customer
# phone            : 0888123456
# email            : test@example.com
# econt_office     : Sofia Office 5
# shipping_address :
# notes            : Test order
