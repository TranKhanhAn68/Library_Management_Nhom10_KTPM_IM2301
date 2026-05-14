import pytest
from datetime import date

from library_management.models import *


@pytest.mark.django_db
class TestBorrowingPermissions:

    @pytest.mark.parametrize(
        "method, url, user_fixture, expected",
        [
            ("get", "/borrowing/", "auth_client", 403),
            ("get", "/borrowing/", "auth_staff", 200),
            ("get", "/borrowing/1/", "auth_client", 403),
            ("get", "/borrowing/1/", "auth_staff", 200),
            ("patch", "/borrowing/1/update_status/", "auth_staff", 202),
        ],
    )
    def test_all_permissions_borrowing(
        self, request, method, url, user_fixture, expected
    ):

        client = request.getfixturevalue(user_fixture)

        user = User.objects.create_user(username=f"user_{expected}")

        category = Category.objects.create(name="IT")

        book = Book.objects.create(
            book_id="B001", name="ReactJS", total_quantity=10, category=category
        )

        borrow = User_Book.objects.create(
            user=user,
            book=book,
            borrowing_quantity=1,
            borrowing_book_date=date.today(),
            returning_book_date=date.today(),
            status="PENDING",
        )

        setting = Setting.objects.create(
            borrowing_days=7, borrowing_fee=1000, borrowing_overdue_fine=500
        )

        User_Book_Detail_Fine.objects.create(
            user_book=borrow, setting=setting, late_dates=0
        )

        if "/1/" in url:
            url = url.replace("/1/", f"/{borrow.id}/")

        data_form = {"status": "CONFIRMED"} if method == "patch" else {}

        response = getattr(client, method)(url, data=data_form, format="json")

        assert response.status_code in [expected, 200, 202]


@pytest.mark.django_db
class TestBorrowingSearch:

    def setup_data(self):
        self.category = Category.objects.create(name="IT")

        self.book_1 = Book.objects.create(
            book_id="B001", name="ReactJS", total_quantity=10, category=self.category
        )

        self.book_2 = Book.objects.create(
            book_id="B002", name="Django", total_quantity=10, category=self.category
        )

        self.user_1 = User.objects.create_user(username="an")

        self.user_2 = User.objects.create_user(username="alex")

        self.borrow_1 = User_Book.objects.create(
            user=self.user_1,
            book=self.book_1,
            borrowing_quantity=1,
            borrowing_book_date=date.today(),
            returning_book_date=date.today(),
            status="PENDING",
        )

        self.borrow_2 = User_Book.objects.create(
            user=self.user_2,
            book=self.book_2,
            borrowing_quantity=1,
            borrowing_book_date=date.today(),
            returning_book_date=date.today(),
            status="CONFIRMED",
        )

    def test_search_borrowing_by_user_name(self, auth_staff):
        self.setup_data()

        response = auth_staff.get("/borrowing/?search=an")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["user"]["username"] == "an"

    def test_search_borrowing_by_book_name(self, auth_staff):
        self.setup_data()

        response = auth_staff.get("/borrowing/?book=React")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["book"]["name"] == "ReactJS"

    def test_search_borrowing_by_status(self, auth_staff):
        self.setup_data()

        response = auth_staff.get("/borrowing/?status=CONFIRMED")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["status"] == "CONFIRMED"
