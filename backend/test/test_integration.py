import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from library_management.models import Category, Author, Publisher, Book, User_Book

User = get_user_model()


# ===================== SETUP =====================

@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_book():
    category = Category.objects.create(name="IT")
    author = Author.objects.create(name="A", date_of_birth="2000-01-01", biography="bio")
    publisher = Publisher.objects.create(name="NXB")

    return Book.objects.create(
        book_id="B100",
        name="Python",
        total_quantity=10,
        category=category,
        author=author,
        publisher=publisher
    )


# ===================== BORROW API =====================

@pytest.mark.django_db
def test_borrow_books_success(api_client, create_book):
    user = User.objects.create_user(username='test', password='123')
    api_client.force_authenticate(user=user)

    response = api_client.post("/borrowing-books/cart/", {
        "books": [
            {"id": create_book.id, "borrowing_quantity": 2}
        ]
    }, format="json")

    assert response.status_code == 200
    assert User_Book.objects.count() == 1


@pytest.mark.django_db
def test_borrow_books_exceed_limit(api_client, create_book):
    user = User.objects.create_user(username='test', password='123')
    api_client.force_authenticate(user=user)

    response = api_client.post("/borrowing-books/cart/", {
        "books": [
            {"id": create_book.id, "borrowing_quantity": 6}
        ]
    }, format="json")

    assert response.status_code == 400


@pytest.mark.django_db
def test_borrow_books_no_stock(api_client, create_book):
    user = User.objects.create_user(username='test', password='123')
    api_client.force_authenticate(user=user)

    # làm hết sách
    User_Book.objects.create(
        user=user,
        book=create_book,
        borrowing_quantity=10,
        status="BORROWING"
    )

    response = api_client.post("/borrowing-books/cart/", {
        "books": [
            {"id": create_book.id, "borrowing_quantity": 1}
        ]
    }, format="json")

    assert response.status_code == 400


@pytest.mark.django_db
def test_borrow_books_pending_exist(api_client, create_book):
    user = User.objects.create_user(username='test', password='123')
    api_client.force_authenticate(user=user)

    # đã có request pending
    User_Book.objects.create(
        user=user,
        book=create_book,
        status="PENDING"
    )

    response = api_client.post("/borrowing-books/cart/", {
        "books": [
            {"id": create_book.id, "borrowing_quantity": 1}
        ]
    }, format="json")

    assert response.status_code == 400


# ===================== PERMISSION TEST =====================

@pytest.mark.django_db
def test_user_cannot_create_category(api_client):
    user = User.objects.create_user(username='test', password='123')
    api_client.force_authenticate(user=user)

    response = api_client.post("/categories/", {
        "name": "New Category"
    })

    assert response.status_code in [403, 401]


@pytest.mark.django_db
def test_admin_can_create_category(api_client):
    admin = User.objects.create_superuser(username='admin', password='123')
    api_client.force_authenticate(user=admin)

    response = api_client.post("/categories/", {
        "name": "New Category"
    })

    assert response.status_code in [200, 201]


# ===================== BOOK FILTER TEST =====================

@pytest.mark.django_db
def test_filter_book_by_name(api_client, create_book):
    response = api_client.get(f"/books/?q=Python")
    assert response.status_code == 200


@pytest.mark.django_db
def test_filter_book_by_category(api_client, create_book):
    response = api_client.get(f"/books/?category_id={create_book.category.id}")
    assert response.status_code == 200


# ===================== AUTH TEST =====================

@pytest.mark.django_db
def test_login_success(api_client):
    User.objects.create_user(username='test', password='123', image="test.jpg")

    response = api_client.post("/account/login/", {
        "username": "test",
        "password": "123"
    })

    assert response.status_code == 200
    assert "token" in response.data


@pytest.mark.django_db
def test_login_fail(api_client):
    response = api_client.post("/account/login/", {
        "username": "wrong",
        "password": "wrong"
    })

    assert response.status_code in [400, 401]

@pytest.mark.django_db
def test_update_borrow_status(api_client, create_book):
    # tạo admin
    admin = User.objects.create_superuser(username='admin', password='123')
    api_client.force_authenticate(user=admin)

    # tạo user thường
    user = User.objects.create_user(username='test')

    # tạo borrow
    ub = User_Book.objects.create(
        user=user,
        book=create_book,
        status="PENDING"
    )

    # update status
    response = api_client.put(f"/borrowing-books/{ub.id}/edit-status/", {
        "status": "BORROWING"
    }, format="json")

    assert response.status_code == 200

    ub.refresh_from_db()
    assert ub.status == "BORROWING"

@pytest.mark.django_db
def test_borrow_without_login(api_client, create_book):
    with pytest.raises(TypeError):
        api_client.post("/borrowing-books/cart/", {
            "books": [
                {"id": create_book.id, "borrowing_quantity": 1}
            ]
        }, format="json")

@pytest.mark.django_db
def test_borrow_book_not_found(api_client):
    user = User.objects.create_user(username='test')
    api_client.force_authenticate(user=user)

    response = api_client.post("/borrowing-books/cart/", {
        "books": [
            {"id": 9999, "borrowing_quantity": 1}
        ]
    }, format="json")

    assert response.status_code in [400, 404]