import pytest
from library_management.models import *


@pytest.mark.django_db
class TestBookAPI:

    def setup_data(self):
        self.category = Category.objects.create(name="IT")
        self.author = Author.objects.create(
            name="Author A", date_of_birth="2000-01-01", biography="Bio"
        )
        self.publisher = Publisher.objects.create(name="NXB")

    def test_create_book(self, auth_admin):
        self.setup_data()

        response = auth_admin.post(
            "/books/",
            {
                "book_id": "B001",
                "name": "Python",
                "total_quantity": 10,
                "description": "Test",
                "active": True,
                "category_id": self.category.id,
                "author_id": self.author.id,
                "publisher_id": self.publisher.id,
            },
            format="json",
        )

        assert response.status_code in [200, 201]
        assert Book.objects.filter(name="Python").exists()

    def test_get_object_book(self, auth_admin):
        self.setup_data()

        book = Book.objects.create(
            name="Python",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )

        response = auth_admin.get(f"/books/{book.id}/")

        assert response.status_code == 200
        assert response.data["name"] == book.name

    def test_get_list_book_with_admin(self, auth_admin):
        self.setup_data()

        Book.objects.create(
            name="A",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )
        Book.objects.create(
            name="B",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )

        response = auth_admin.get("/books/")

        assert response.status_code == 200
        assert response.data["count"] == 2

    def test_patch_book(self, auth_admin):
        self.setup_data()

        book = Book.objects.create(
            name="Python",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )

        response = auth_admin.patch(f"/books/{book.id}/", {"total_quantity": 20})

        assert response.status_code == 200
        assert Book.objects.get(id=book.id).total_quantity == 20

    def test_delete_book(self, auth_admin):
        self.setup_data()

        book = Book.objects.create(
            name="Python",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )

        response = auth_admin.delete(f"/books/{book.id}/")

        assert response.status_code in [200, 204]
        assert not Book.objects.filter(id=book.id).exists()

    def test_search_book_by_name(self, auth_admin):
        self.setup_data()

        Book.objects.create(
            name="Harry Potter",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )

        Book.objects.create(
            name="Doraemon",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )

        response = auth_admin.get("/books/?q=Harry")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == "Harry Potter"

    def test_filter_book_by_category(self, auth_admin):
        self.setup_data()

        another_category = Category.objects.create(name="Novel")

        Book.objects.create(
            name="Book A",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )

        Book.objects.create(
            name="Book B",
            total_quantity=10,
            category=another_category,
            author=self.author,
            publisher=self.publisher,
        )

        response = auth_admin.get(f"/books/?category_id={self.category.id}")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == "Book A"

    def test_filter_book_by_author(self, auth_admin):
        self.setup_data()

        another_author = Author.objects.create(
            name="Author 2", date_of_birth="1970-01-01"
        )

        Book.objects.create(
            name="Book A",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher,
        )

        Book.objects.create(
            name="Book B",
            total_quantity=10,
            category=self.category,
            author=another_author,
            publisher=self.publisher,
        )

        response = auth_admin.get(f"/books/?author_id={self.author.id}")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == "Book A"
