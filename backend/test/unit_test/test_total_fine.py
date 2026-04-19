import pytest
from datetime import timedelta

from library_management.models import *

@pytest.mark.django_db
def test_total_fine():
    setting = Setting.objects.create(
        borrowing_days=7,
        borrowing_fee=100,
        borrowing_overdue_fine=10
    )

    user = User.objects.create_user(username='test')
    book = Book.objects.create(
        book_id="B004",
        name="Python",
        total_quantity=10
    )
     
    user_book = User_Book.objects.create(
        user=user, 
        book=book,
        borrowing_book_date=date.today(),
        status="CONFIRMED"
    )
    
    detail = User_Book_Detail_Fine.objects.create(
        user_book=user_book,
        late_dates=3,
        setting=setting
    )

    assert detail.total_fine() == 30
    
@pytest.mark.django_db
def test_total_fine_without_late_dates():
    setting = Setting.objects.create(
        borrowing_days=7,
        borrowing_fee=100,
        borrowing_overdue_fine=10
    )

    user = User.objects.create_user(username='test')
    book = Book.objects.create(
        book_id="B004",
        name="Python",
        total_quantity=10
    )
     
    user_book = User_Book.objects.create(
        user=user, 
        book=book,
        borrowing_book_date=date.today(),
        status="CONFIRMED"
    )
    
    detail = User_Book_Detail_Fine.objects.create(
        user_book=user_book,
        setting=setting
    )

    assert detail.total_fine() == 0