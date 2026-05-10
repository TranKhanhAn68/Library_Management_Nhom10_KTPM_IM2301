import pytest
from datetime import date
from rest_framework.test import APIClient

from library_management.models import *

@pytest.mark.django_db
class TestBorrowingAPI:

    def test_get_list_borrowing(self):

        api_client = APIClient()

        admin = User.objects.create_superuser(
            username="admin",
            password="123"
        )

        api_client.force_authenticate(user=admin)

        user = User.objects.create_user(
            username="borrow_user_1"
        )

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="B001",
            name="Python",
            total_quantity=10,
            category=category
        )

        User_Book.objects.create(
            user=user,
            book=book,
            borrowing_quantity=1,
            borrowing_book_date=date.today(),
            returning_book_date=date.today(),
            status="PENDING"
        )

        response = api_client.get("/borrowing/")

        assert response.status_code == 200


    def test_get_detail_borrowing(self):

        api_client = APIClient()

        admin = User.objects.create_superuser(
            username="admin2",
            password="123"
        )

        api_client.force_authenticate(user=admin)

        user = User.objects.create_user(
            username="borrow_user_2"
        )

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="B002",
            name="Java",
            total_quantity=10,
            category=category
        )

        borrow = User_Book.objects.create(
            user=user,
            book=book,
            borrowing_quantity=1,
            borrowing_book_date=date.today(),
            returning_book_date=date.today(),
            status="PENDING"
        )

        response = api_client.get(
            f"/borrowing/{borrow.id}/"
        )

        assert response.status_code == 200


    def test_create_borrowing(self):

        api_client = APIClient()

        user = User.objects.create_user(
            username="member",
            password="123"
        )

        api_client.force_authenticate(user=user)

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="B003",
            name="Django",
            total_quantity=10,
            category=category
        )

        response = api_client.post(
    "/borrowing/cart/",
    {
        "cart": [
            {
                "book_id": book.id,
                "borrowing_quantity": 1
            }
        ]
    },
    format="json"
)

        assert response.status_code in [200, 201, 400]