#!/bin/bash

echo "🚀 Activate virtual environment..."
source .venv/bin/activate   # nếu bạn dùng .venv

echo "🧹 Flush database..."
py manage.py flush --no-input

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