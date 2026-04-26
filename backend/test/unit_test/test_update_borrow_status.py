import pytest

from library_management.models import *

import pytest
from unittest.mock import patch
from datetime import date
from library_management.models import User_Book
from backend.library_management.services.borrowing_services import update_borrow_status
@pytest.fixture
def user(db):
    return User.objects.create_user(username="test")


@pytest.fixture
def books(db):
    book1 = Book.objects.create(book_id="B003", name="Python", total_quantity=10)
    book2 = Book.objects.create(book_id="B004", name="Java", total_quantity=10)
    return book1, book2

@pytest.mark.django_db
def test_update_borrow_status_borrowing_and_update_borrowing_date(user, books):
    book1, _ = books
    borrow = User_Book.objects.create(
        user=user,
        book=book1,
        status="CONFIRMED",
        borrowing_book_date=None,
        returning_book_date=None,
    )

    with patch("django.utils.timezone.now") as mock_now:
        mock_now.return_value = date(2026, 1, 1)

        result = update_borrow_status(borrow, "BORROWING")

    assert result.status == "BORROWING"
    assert result.borrowing_book_date == date(2026, 1, 1)
    
    
@pytest.mark.django_db
def test_update_borrow_status_returned_and_update_returned_date(user, books):
    book1, _ = books
    borrow = User_Book.objects.create(
        user=user,
        book=book1,
        status="BORROWING",
        borrowing_book_date=None,
        returning_book_date=None,
    )

    with patch("django.utils.timezone.now") as mock_now:
        mock_now.return_value = date(2026, 1, 2)
        result = update_borrow_status(borrow, "RETURNED")

    assert result.status == "RETURNED"
    assert result.returning_book_date == date(2026, 1, 2)
    
@pytest.mark.django_db
def test_update_borrow_status_invalid(user, books):
    book1, _ = books
    borrow = User_Book.objects.create(
        user=user,
        book=book1,
        status="CONFIRMED",
        borrowing_book_date=None,
        returning_book_date=None,
    )
    with pytest.raises(ValueError) as info:
        update_borrow_status(borrow, "Invalid")
    assert str(info.value) == "Trạng thái không hợp lệ!"
    
@pytest.mark.django_db
def test_update_borrow_status_no_date_change(user, books):
    book1, _ = books

    borrow = User_Book.objects.create(
        user=user,
        book=book1,
        status="PENDING",
        borrowing_book_date=None,
        returning_book_date=None,
    )

    result = update_borrow_status(borrow, "CONFIRMED")

    assert result.status == "CONFIRMED"
    assert result.borrowing_book_date is None
    assert result.returning_book_date is None
    

    