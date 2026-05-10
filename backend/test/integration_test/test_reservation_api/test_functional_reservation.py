import pytest
from datetime import date

from library_management.models import *

@pytest.mark.django_db
class TestReservationPermissions:

    @pytest.mark.parametrize(
        "method, url, user_fixture, expected",
        [
            # auth_client bị cấm
            ("get", "/reservations/", "auth_client", 403),

            # staff được phép
            ("get", "/reservations/", "auth_staff", 200),

            ("get", "/reservations/1/", "auth_client", 403),

            ("get", "/reservations/1/", "auth_staff", 200),

            # update_status đang trả 400
            ("patch", "/reservations/1/update_status/", "auth_staff", 400),
        ]
    )
    def test_all_permissions_reservation(
        self,
        request,
        method,
        url,
        user_fixture,
        expected
    ):

        client = request.getfixturevalue(user_fixture)

        user = User.objects.create_user(
            username=f"reservation_{expected}"
        )

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id=f"R{expected}",
            name="ReactJS",
            total_quantity=10,
            category=category
        )

        reservation = Reservation.objects.create(
            user=user,
            book=book,
            reservation_date=date.today(),
            status="WAITING"
        )

        if "/1/" in url:
            url = url.replace(
                "/1/",
                f"/{reservation.id}/"
            )

        data_form = {
            "status": "WAITING"
        } if method == "patch" else {}

        response = getattr(client, method)(
            url,
            data=data_form,
            format="json"
        )

        assert response.status_code == expected