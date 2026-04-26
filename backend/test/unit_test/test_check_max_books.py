import pytest
from backend.library_management.services import borrowing_services
from library_management.models import *
from library_management.services import constraint

@pytest.fixture
def user(db):
    return User.objects.create_user(username="test")


@pytest.fixture
def books(db):
    book1 = Book.objects.create(book_id="B003", name="Python", total_quantity=10)
    book2 = Book.objects.create(book_id="B004", name="Java", total_quantity=10)
    return book1, book2

# Test số lượng book có thể mượn
@pytest.mark.django_db
def test_check_max_books_below_max(user, books):
    book1, book2 = books

    cart = [
        {
            "book_id": book1.id,
            "name": book1.name,
            "date": "2026-01-01",
            "borrowing_quantity": 3,
        },
        {
            "book_id": book2.id,
            "name": book2.name,
            "date": "2026-01-01",
            "borrowing_quantity": 1,
        },
    ]
    assert borrowing_services.check_max_books(user, cart) is True
    
@pytest.mark.django_db
def test_check_max_books_with_available_borrow_below_max(user, books):
    book1, book2 = books

    User_Book.objects.create(
        user=user,
        book=book1,
        borrowing_quantity=2,
        status="BORROWING"
    )
    cart = [
        {
            "book_id": book2.id,
            "name": book2.name,
            "date": "2026-01-01",
            "borrowing_quantity": 2,
        }
    ]
    assert borrowing_services.check_max_books(user, cart) is True
    
    
@pytest.mark.django_db
def test_check_max_books_at_max(user, books):
    book1, book2 =books
    
    cart = [
        {
            "book_id": book1.id,
            "name": book1.name,
            "date": "2026-01-01",
            "borrowing_quantity": 3,
        },
        {
            "book_id": book2.id,
            "name": book2.name,
            "date": "2026-01-01",
            "borrowing_quantity": 2,
        },
    ]
    assert borrowing_services.check_max_books(user, cart) is True
    
@pytest.mark.django_db
def test_check_max_books_with_available_borrow_at_max(user, books):
    book1, book2 = books

    User_Book.objects.create(
        user=user,
        book=book1,
        borrowing_quantity=2,
        status="BORROWING"
    )
    cart = [
        {
            "book_id": book2.id,
            "name": book2.name,
            "date": "2026-01-01",
            "borrowing_quantity": 3,
        }
    ]
    assert borrowing_services.check_max_books(user, cart) is True
    
@pytest.mark.django_db
def test_check_max_books_above_max(user, books):
    book1, book2 = books

    cart = [
        {
            "book_id": book1.id,
            "name": book1.name,
            "date": "2026-01-01",
            "borrowing_quantity": 3,
        },
        {
            "book_id": book2.id,
            "name": book2.name,
            "date": "2026-01-01",
            "borrowing_quantity": 3,
        },
    ]
    with pytest.raises(ValueError) as info:
        borrowing_services.check_max_books(user, cart)
    assert str(info.value) == f"Không thể mượn quá {constraint.MAX_BORROW_BOOKS} sách"
    
@pytest.mark.django_db
def test_check_max_books_with_available_borrow_above_max(user, books):
    book1, book2 = books

    User_Book.objects.create(
        user=user,
        book=book1,
        borrowing_quantity=2,
        status="BORROWING"
    )
    cart = [
        {
            "book_id": book2.id,
            "name": book2.name,
            "date": "2026-01-01",
            "borrowing_quantity": 4,
        }
    ]
    with pytest.raises(ValueError) as info:
        borrowing_services.check_max_books(user, cart)
    assert str(info.value) == f"Không thể mượn quá {constraint.MAX_BORROW_BOOKS} sách"
    

    
