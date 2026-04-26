import pytest

from library_management.models import *

@pytest.mark.django_db
def test_available_quantity_with_PENDING():
    user = User.objects.create_user(username='test')

    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    book = Book.objects.create(
        book_id="B003",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
    )

    assert book.available_quantity() == 10


@pytest.mark.django_db
def test_available_quantity_with_CONFIRMED():
    user = User.objects.create_user(username='test')
    
    book = Book.objects.create(
        book_id="B003",
        name="Python",
        total_quantity=10,
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=2,
        status="CONFIRMED"
    )

    assert book.available_quantity() == 8
    
@pytest.mark.django_db
def test_available_quantity_with_CONFIRMED():
    user = User.objects.create_user(username='test')
    
    book = Book.objects.create(
        book_id="B003",
        name="Python",
        total_quantity=10,
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=2,
        status="CONFIRMED"
    )

    assert book.available_quantity() == 8
    
    
@pytest.mark.django_db
def test_available_quantity_with_BORROWING():
    user = User.objects.create_user(username='test')
    
    book = Book.objects.create(
        book_id="B003",
        name="Python",
        total_quantity=10,
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
        status="BORROWING"
    )
    assert book.available_quantity() == 7
    
@pytest.mark.django_db
def test_available_quantity_with_RETURNED():
    user = User.objects.create_user(username='test')
    
    book = Book.objects.create(
        book_id="B003",
        name="Python",
        total_quantity=10,
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
        status="RETURNED",
    )
    assert book.available_quantity() == 10
    
    
@pytest.mark.django_db
def test_available_quantity_with_OVERDUE():
    user = User.objects.create_user(username='test')
    
    book = Book.objects.create(
        book_id="B003",
        name="Python",
        total_quantity=10,
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
        status="OVERDUE"
    )
    assert book.available_quantity() == 7
    
@pytest.mark.django_db
def test_available_quantity_with_CANCELLED():
    user = User.objects.create_user(username='test')
    book = Book.objects.create(
        book_id="B003",
        name="Python",
        total_quantity=10,
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
        status="CANCELLED"
    )
    assert book.available_quantity() == 10
    

    
    