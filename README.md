# GSM Shop — Online Store & Repair Service Platform

A full-stack web platform for a real-world GSM (phone & accessories) shop that also offers phone repair services. The site combines an online store (cash/card-on-delivery via Econt), a services/repairs listing, and a location/gallery section showcasing the physical shop.

## Project Status

🚧 **In active development.** Backend API is functional; frontend not yet started.

## Tech Stack

- **Backend:** Django + Django REST Framework
- **Database:** PostgreSQL
- **Frontend:** React (planned — not yet implemented)
- **Shipping:** Econt (cash-on-delivery flow; no online payment gateway currently)

## Project Structure

```
gsm-shop/
├── backend/
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py        # Shared settings
│   │   │   ├── dev.py         # Local dev overrides
│   │   │   └── prod.py        # Production overrides
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   │
│   ├── apps/
│   │   ├── catalog/            # Products, categories, product images
│   │   ├── orders/              # Orders, order items, checkout logic
│   │   ├── services/             # Repair/services listing
│   │   ├── shop_info/             # Shop location, gallery, general shop info
│   │   └── core/                  # Shared abstract base models
│   │
│   ├── media/                     # User-uploaded images (gitignored)
│   ├── manage.py
│   ├── requirements/
│   │   └── base.txt
│   ├── .env                       # Local secrets (gitignored, not committed)
│   └── .env.example                # Template for required env vars
│
└── frontend/                       # React app (planned)
```

## Backend Setup (Local Development)

### 1. Prerequisites
- Python 3.11+
- PostgreSQL 15+
- A virtual environment tool (`venv`)

### 2. Clone and install dependencies

```bash
git clone https://github.com/KristianYanakov/GSM_Service
cd gsm-shop/backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements/base.txt
```

### 3. Configure environment variables

Copy the example file and fill in real values:

```bash
cp .env.example .env
```

Required variables (see `.env.example` for the full list):

| Variable | Description |
|---|---|
| `DJANGO_SECRET_KEY` | Generate with `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `DJANGO_DEBUG` | `True` for local dev |
| `DJANGO_ALLOWED_HOSTS` | e.g. `localhost,127.0.0.1` |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | PostgreSQL connection details |
| `CORS_ALLOWED_ORIGINS` | Frontend origin, e.g. `http://localhost:5173` |

### 4. Set up PostgreSQL

```sql
CREATE DATABASE gsm_shop;
CREATE USER gsm_shop_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE gsm_shop TO gsm_shop_user;
```

> **Note (Postgres 15+):** the `public` schema no longer grants `CREATE` to all users by default. Connect to the `gsm_shop` database specifically and run:
> ```sql
> GRANT ALL ON SCHEMA public TO gsm_shop_user;
> ```

### 5. Run migrations and create an admin user

```bash
python manage.py migrate
python manage.py createsuperuser
```

### 6. Run the dev server

```bash
python manage.py runserver
```

- Admin panel: `http://127.0.0.1:8000/admin/`
- API root: `http://127.0.0.1:8000/api/`

## API Overview

All endpoints are prefixed with `/api/`.

### Catalog
| Method | Endpoint | Description |
|---|---|---|
| GET | `/catalog/categories/` | List product categories |
| GET | `/catalog/products/` | List active products (paginated). Supports `?category=<slug>` and `?type=phone\|accessory` |
| GET | `/catalog/products/<slug>/` | Product detail with full image gallery |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders/` | Create a new order (public, rate-limited to 5/hour per IP) |
| GET | `/orders/<order_number>/` | Retrieve order status by UUID (given to customer at checkout) |

> There is intentionally **no** endpoint to list all orders publicly. Order management happens via Django admin only.

### Services
| Method | Endpoint | Description |
|---|---|---|
| GET | `/services/categories/` | List service categories |
| GET | `/services/` | List active repair/services offered |

### Shop Info
| Method | Endpoint | Description |
|---|---|---|
| GET | `/shop-info/locations/` | List shop location(s) with coordinates & hours |
| GET | `/shop-info/gallery/` | List gallery images, ordered for display |
| GET | `/shop-info/info/` | Shop-level info (about text, staff blurb, socials) — singleton |

## Key Design Decisions

- **Order security:** Orders are looked up via a non-sequential `UUID` (`order_number`), not the database's auto-incrementing ID, to prevent customers from guessing/enumerating other people's orders.
- **Price integrity:** `OrderItem.price_at_purchase` is snapshotted from the product's price at order time and is never editable after creation, so historical orders remain accurate even if product prices change later.
- **Order total is computed, not entered:** `Order.total_price` is automatically recalculated via a signal whenever order items are added, changed, or removed — it cannot be manually overridden.
- **Abuse protection on checkout:** The public order-creation endpoint is protected with DRF rate limiting (5 requests/hour per IP) and a honeypot field to deter basic bots.
- **Read/write serializer separation:** Orders use separate serializers for customer-submitted data (`OrderCreateSerializer`) vs. server-rendered data (`OrderReadSerializer`), so customers can never set fields like `status` or `total_price` themselves.
- **Singleton pattern for `ShopInfo`:** Enforced both at the model level (`save()` pins `pk=1`) and in Django admin (add/delete permissions disabled once one row exists), since there's only ever one shop-info record.

## Environment & Secrets

- `.env` files are **never committed** — only `.env.example` templates are tracked.
- Media uploads (`backend/media/`) are gitignored; they should be handled via object storage (e.g. S3) in production, not stored in git.
- Database: PostgreSQL is used in both development and production — SQLite is not used, to avoid concurrency issues with simultaneous order writes.

## Roadmap

- [ ] React frontend (store grid, product detail, cart, checkout, services page, gallery, map)
- [ ] Econt shipping integration (office selection, tracking sync)
- [ ] Production deployment config (`prod.py` settings, HTTPS, shared cache backend for rate limiting across workers)
- [ ] Optional: staff member profiles, online prepayment option

## License

Kristian Yanakov — (LICENSE)
