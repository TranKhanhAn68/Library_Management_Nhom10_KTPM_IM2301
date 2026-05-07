import pytest
from library_management.models import *
from test.integration_test.helpers import assert_active_filter

@pytest.mark.django_db
class TestBookPermission:

    def setup_data(self):
        self.category = Category.objects.create(name="IT")
        self.author = Author.objects.create(
            name="Author A",
            date_of_birth="2000-01-01",
            biography="Bio"
        )
        self.publisher = Publisher.objects.create(name="NXB")

    @pytest.mark.parametrize("user_fixture,expected", [
        ("api_client", 3),
        ("auth_client", 3),
        ("auth_admin", 3),
    ])
    def test_get_list_book(self, request, user_fixture, expected):
        self.setup_data()

        user = request.getfixturevalue(user_fixture)

        Book.objects.create(name="A", total_quantity=10, category=self.category, author=self.author, publisher=self.publisher)
        Book.objects.create(name="B", total_quantity=10, category=self.category, author=self.author, publisher=self.publisher)
        Book.objects.create(name="C", total_quantity=10, category=self.category, author=self.author, publisher=self.publisher)

        response = user.get("/books/")

        assert response.status_code == 200
        assert response.data["count"] == expected

    @pytest.mark.parametrize("user_fixture,expected_keys", [
        ("api_client", ["id", "name"]),
        ("auth_client", ["id", "name"]),
        ("auth_admin", ["id", "name", "total_quantity"]),
    ])
    def test_get_object_book(self, request, user_fixture, expected_keys):
        self.setup_data()

        user = request.getfixturevalue(user_fixture)

        book = Book.objects.create(
            name="Python",
            total_quantity=10,
            category=self.category,
            author=self.author,
            publisher=self.publisher
        )

        response = user.get(f"/books/{book.id}/")

        assert response.status_code == 200

        for key in expected_keys:
            assert key in response.data