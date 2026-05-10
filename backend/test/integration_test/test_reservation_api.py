import pytest
from datetime import date

from library_management.models import *

@pytest.mark.django_db
class TestReservationAPI:

    def test_get_list_reservation(self, auth_staff):

        user = User.objects.create_user(
            username="reservation_user_1"
        )

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="R001",
            name="Python",
            total_quantity=10,
            category=category
        )

        Reservation.objects.create(
            user=user,
            book=book,
            reservation_date=date.today(),
            status="PENDING"
        )

        response = auth_staff.get("/reservations/")

        assert response.status_code == 200


    def test_get_detail_reservation(self, auth_staff):

        user = User.objects.create_user(
            username="reservation_user_2"
        )

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="R002",
            name="Java",
            total_quantity=10,
            category=category
        )

        reservation = Reservation.objects.create(
            user=user,
            book=book,
            reservation_date=date.today(),
            status="PENDING"
        )

        response = auth_staff.get(
            f"/reservations/{reservation.id}/"
        )

        assert response.status_code == 200


    def test_create_reservation(self, auth_client):

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="R003",
            name="Django",
            total_quantity=10,
            category=category
        )

        response = auth_client.post(
            "/reservations/order/",
            {
                "book": book.id
            },
            format="json"
        )

        assert response.status_code in [200, 201]