import pytest
from datetime import timedelta

from library_management.models import *

@pytest.mark.django_db
def test_set_due_date():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")

    book = Book.objects.create(
        book_id="B004",
        name="Python",
        total_quantity=10,
        category=category,
        
    )

    ub = User_Book.objects.create(
        user=user, 
        book=book,
        borrowing_book_date=date.today(),
        status="CONFIRMED"
    )

    ub.set_due_date(7)

    assert ub.due_date == ub.borrowing_book_date + timedelta(days=7)
    
@pytest.mark.django_db
def test_is_overdue_true():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")

    book = Book.objects.create(
        book_id="B004",
        name="Python",
        total_quantity=10,
        category=category,
    )
    ub = User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
        status="BORROWING",
        borrowing_book_date=date.today() - timedelta(days=30)
    )

    ub.set_due_date(7)
    assert ub.is_overdue()
    
    
@pytest.mark.django_db
def test_is_overdue_false():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")

    book = Book.objects.create(
        book_id="B004",
        name="Python",
        total_quantity=10,
        category=category,
    )
    ub = User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
        status="BORROWING",
        borrowing_book_date=date.today()
    )

    ub.set_due_date(7)
    assert ub.is_overdue() is False
    
@pytest.mark.django_db
def test_is_overdue_without_due_date():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")

    book = Book.objects.create(
        book_id="B004",
        name="Python",
        total_quantity=10,
        category=category,
    )
    
    ub = User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
        status="BORROWING",
        borrowing_book_date=date.today()
    )
    
    assert ub.is_overdue() is False

