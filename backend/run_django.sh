#!/bin/bash

echo "🚀 Activate virtual environment..."
source venv/bin/activate

echo "📦 Apply migrations..."
python manage.py makemigrations
python manage.py migrate

echo "📥 Load initial data..."
python manage.py loaddata authors.json

echo "🖥️ Run server..."
python manage.py runserver