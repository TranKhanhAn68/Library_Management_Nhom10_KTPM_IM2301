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
        ],
    )
    def test_all_permissions_reservation(
        self, request, method, url, user_fixture, expected
    ):

        client = request.getfixturevalue(user_fixture)

        user = User.objects.create_user(username=f"reservation_{expected}")

        category = Category.objects.create(name="IT")

        book = Book.objects.create(
            book_id=f"R{expected}", name="ReactJS", total_quantity=10, category=category
        )

        reservation = Reservation.objects.create(
            user=user, book=book, reservation_date=date.today(), status="WAITING"
        )

        if "/1/" in url:
            url = url.replace("/1/", f"/{reservation.id}/")

        data_form = {"status": "WAITING"} if method == "patch" else {}

        response = getattr(client, method)(url, data=data_form, format="json")

        assert response.status_code == expected


@pytest.mark.django_db
class TestReservationSearch:
    def setup_data(self):
        self.category = Category.objects.create(name="IT")

        self.book_1 = Book.objects.create(
            book_id="B001", name="ReactJS", total_quantity=10, category=self.category
        )

        self.book_2 = Book.objects.create(
            book_id="B002", name="Django", total_quantity=10, category=self.category
        )

        self.user_1 = User.objects.create_user(username="alex")

        self.user_2 = User.objects.create_user(username="khanh")

        self.reservation_1 = Reservation.objects.create(
            user=self.user_1,
            book=self.book_1,
            reservation_date=date.today(),
            status="WAITING",
        )

        self.reservation_2 = Reservation.objects.create(
            user=self.user_2,
            book=self.book_2,
            reservation_date=date.today(),
            status="APPROVED",
        )

    def test_search_reservation_by_user_name(self, auth_staff):
        self.setup_data()

        response = auth_staff.get("/reservations/?search=alex")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["user"]["username"] == "alex"

    def test_search_reservation_by_book_name(self, auth_staff):
        self.setup_data()

        response = auth_staff.get("/reservations/?book=React")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["book"]["name"] == "ReactJS"

    def test_search_reservation_by_status(self, auth_staff):
        self.setup_data()

        response = auth_staff.get("/reservations/?status=WAITING")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["status"] == "WAITING"
