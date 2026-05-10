import pytest
from library_management.models import *

@pytest.mark.django_db
class TestBorrowingRolePermission:

    def test_client_cannot_update_status(self, auth_client):

        category = Category.objects.create(
            name="IT"
        )

        user = User.objects.create_user(
            username="member1"
        )

        book = Book.objects.create(
            book_id="B001",
            name="Python",
            total_quantity=10,
            category=category
        )

        borrow = User_Book.objects.create(
            user=user,
            book=book,
            status="PENDING"
        )

        response = auth_client.patch(
            f"/borrowing/{borrow.id}/update_status/",
            {
                "status": "CONFIRMED"
            },
            format="json"
        )

        assert response.status_code == 403


    def test_staff_can_update_status(self, auth_staff):

        category = Category.objects.create(
            name="IT"
        )

        user = User.objects.create_user(
            username="member2"
        )

        book = Book.objects.create(
            book_id="B005",
            name="Flask",
            total_quantity=10,
            category=category
        )

        borrow = User_Book.objects.create(
            user=user,
            book=book,
            status="PENDING"
        )

        # FIX lỗi user_book_detail_fine
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

        response = auth_staff.patch(
            f"/borrowing/{borrow.id}/update_status/",
            {
                "status": "CONFIRMED"
            },
            format="json"
        )

        assert response.status_code in [200, 202]