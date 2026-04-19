import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError
from datetime import timedelta

from library_management.models import (
    Category, Author, Publisher, Book,
    User_Book, Like, Setting, User_Book_Detail_Fine
)

from library_management.views import check_stock_and_create

User = get_user_model()


# ===================== MODEL TEST =====================


# Test str  của từng class
@pytest.mark.django_db
def test_author_str():
    author = Author.objects.create(
        name="Nguyen Van A",
        date_of_birth="2000-01-01",
        biography="abc"
    )
    assert str(author) == "Nguyen Van A"


@pytest.mark.django_db
def test_category_str():
    category = Category.objects.create(name="IT")
    assert str(category) == "IT"


@pytest.mark.django_db
def test_publisher_str():
    publisher = Publisher.objects.create(name="NXB Kim Dong")
    assert str(publisher) == "NXB Kim Dong"


# Test trạng thái khi tạo từng sách
@pytest.mark.django_db
def test_user_book_default_status():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B001",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    ub = User_Book.objects.create(user=user, book=book)

    assert ub.status == User_Book.BorrowStatus.PENDING





@pytest.mark.django_db
def test_set_due_date():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B004",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    ub = User_Book.objects.create(user=user, book=book)

    ub.set_due_date(7)

    assert ub.due_date == ub.borrowing_book_date + timedelta(days=7)


@pytest.mark.django_db
def test_total_fine():
    user = User.objects.create_user(username='test')

    setting = Setting.objects.create(
        borrowing_days=7,
        borrowing_fee=10,
        borrowing_overdue_fine=5
    )

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B005",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    ub = User_Book.objects.create(user=user, book=book)

    fine = User_Book_Detail_Fine.objects.create(
        user_book=ub,
        late_dates=3,
        setting=setting
    )

    assert fine.total_fine() == 15


# ===================== FUNCTION TEST =====================

@pytest.mark.django_db
def test_check_stock_and_create_success():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B006",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    result = check_stock_and_create(user, {
        "id": book.id,
        "borrowing_quantity": 2
    })

    assert result == "Python"


@pytest.mark.django_db
def test_check_stock_and_create_fail():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B007",
        name="Python",
        total_quantity=1,
        category=category,
        author=author,
        publisher=publisher
    )

    with pytest.raises(ValueError):
        check_stock_and_create(user, {
            "id": book.id,
            "borrowing_quantity": 5
        })


@pytest.mark.django_db
def test_check_stock_quantity_saved():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B008",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    check_stock_and_create(user, {
        "id": book.id,
        "borrowing_quantity": 3
    })

    ub = User_Book.objects.first()

    assert ub.borrowing_quantity == 1

@pytest.mark.django_db
def test_borrow_exact_quantity():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B009",
        name="Python",
        total_quantity=3,
        category=category,
        author=author,
        publisher=publisher
    )

    result = check_stock_and_create(user, {
        "id": book.id,
        "borrowing_quantity": 3
    })

    assert result == "Python"

@pytest.mark.django_db
def test_borrow_zero_quantity():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B010",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    result = check_stock_and_create(user, {
        "id": book.id,
        "borrowing_quantity": 0
    })

    assert result == "Python"


@pytest.mark.django_db
def test_book_not_found():
    user = User.objects.create_user(username='test')

    
    with pytest.raises(Exception):
        check_stock_and_create(user, {
            "book_id": 9999,
            "borrowing_quantity": 1
        })


@pytest.mark.django_db
def test_borrow_when_no_stock():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B011",
        name="Python",
        total_quantity=1,
        category=category,
        author=author,
        publisher=publisher
    )

    # làm hết sách
    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=1,
        status="BORROWING"
    )

    with pytest.raises(ValueError):
        check_stock_and_create(user, {
            "id": book.id,
            "borrowing_quantity": 1
        })


@pytest.mark.django_db
def test_available_quantity_ignore_returned():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B012",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=5,
        status="RETURNED"
    )

    assert book.available_quantity() == 10