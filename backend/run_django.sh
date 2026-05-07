#!/bin/bash

echo "=== Cài đặt thư viện ==="
pip install -r requirements.txt

echo "📦 Migrate..."
py manage.py migrate

echo "=== Tạo superuser ==="
export DJANGO_SUPERUSER_USERNAME=admin
export DJANGO_SUPERUSER_EMAIL=admin@example.com
export DJANGO_SUPERUSER_PASSWORD=Admin@123
py manage.py createsuperuser --no-input || echo "Superuser đã tồn tại!"

echo "📥 Load data..."
py manage.py loaddata db.json/Author.json
py manage.py loaddata db.json/Category.json
py manage.py loaddata db.json/Publisher.json
py manage.py loaddata db.json/Book.json
py manage.py loaddata db.json/Setting.json



python manage.py createsuperuser --no-input || echo "Superuser đã tồn tại!"

echo "🖥️ Run server..."
py manage.py runserver