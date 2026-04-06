import pytest
from django.contrib.auth import get_user_model
from django.db import IntegrityError

from library_management.models import (
    Category, Author, Publisher, Book,
    User_Book, Like)

from library_management.views import check_stock_and_create

User = get_user_model()


# MODEL TEST 

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


@pytest.mark.django_db
def test_user_book_default_status():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        name="Python",
        available_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    ub = User_Book.objects.create(user=user, book=book)

    assert ub.status == User_Book.BorrowStatus.PENDING


@pytest.mark.django_db
def test_like_unique_constraint():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        name="Python",
        available_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    Like.objects.create(user=user, book=book)

    with pytest.raises(IntegrityError):
        Like.objects.create(user=user, book=book)


# FUNCTION TEST 

@pytest.mark.django_db
def test_check_stock_and_create_success():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        name="Python",
        available_quantity=10,
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
        book_id="B001",
        name="Python",
        available_quantity=1,
        category=category,
        author=author,
        publisher=publisher
    )

    with pytest.raises(ValueError):
        check_stock_and_create(user, {
            "id": book.id,
            "borrowing_quantity": 5
        })