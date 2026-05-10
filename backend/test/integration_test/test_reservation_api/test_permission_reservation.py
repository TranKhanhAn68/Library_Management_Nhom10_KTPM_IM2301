import pytest
from datetime import date

from library_management.models import *

@pytest.mark.django_db
class TestReservationRolePermission:

    def test_client_cannot_update_status(
        self,
        auth_client
    ):

        user = User.objects.create_user(
            username="reservation_member_1"
        )

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="R010",
            name="Flask",
            total_quantity=10,
            category=category
        )

        reservation = Reservation.objects.create(
            user=user,
            book=book,
            reservation_date=date.today(),
            status="PENDING"
        )

        response = auth_client.patch(
            f"/reservations/{reservation.id}/update_status/",
            {
                "status": "CONFIRMED"
            },
            format="json"
        )

        assert response.status_code == 403


    def test_staff_can_update_status(
        self,
        auth_staff
    ):

        user = User.objects.create_user(
            username="reservation_member_2"
        )

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="R011",
            name="Laravel",
            total_quantity=10,
            category=category
        )

        reservation = Reservation.objects.create(
            user=user,
            book=book,
            reservation_date=date.today(),
            status="PENDING"
        )

        response = auth_staff.patch(
            f"/reservations/{reservation.id}/update_status/",
            {
                "status": "CONFIRMED"
            },
            format="json"
        )

        assert response.status_code in [200, 202, 400]