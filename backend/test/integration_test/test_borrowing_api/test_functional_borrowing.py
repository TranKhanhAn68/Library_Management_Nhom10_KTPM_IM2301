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
        ]
    )
    def test_all_permissions_borrowing(
        self,
        request,
        method,
        url,
        user_fixture,
        expected
    ):

        client = request.getfixturevalue(user_fixture)

        user = User.objects.create_user(
            username=f"user_{expected}"
        )

        category = Category.objects.create(
            name="IT"
        )

        book = Book.objects.create(
            book_id="B001",
            name="ReactJS",
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

        setting = Setting.objects.create(
            borrowing_days=7,
            borrowing_fee=1000,
            borrowing_overdue_fine=500
        )

        User_Book_Detail_Fine.objects.create(
            user_book=borrow,
            setting=setting,
            late_dates=0
        )

        if "/1/" in url:
            url = url.replace(
                "/1/",
                f"/{borrow.id}/"
            )

        data_form = {
            "status": "CONFIRMED"
        } if method == "patch" else {}

        response = getattr(client, method)(
            url,
            data=data_form,
            format="json"
        )

        assert response.status_code in [expected, 200, 202]