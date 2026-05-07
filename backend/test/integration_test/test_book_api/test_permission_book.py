import pytest
from library_management.models import *
from test.integration_test.helpers import generate_permissions_matrix

@pytest.mark.django_db
class TestBookPermissions:

    @pytest.mark.parametrize(
        "method, url, user_fixture, expected",
        generate_permissions_matrix("/books/")
    )
    def test_all_permissions_book(self, request, method, url, user_fixture, expected):

        client = request.getfixturevalue(user_fixture)

        # setup data
        category = Category.objects.create(name="IT")

        author = Author.objects.create(
            name="Author A",
            date_of_birth="2000-01-01",
            biography="Bio"
        )

        publisher = Publisher.objects.create(
            name="NXB"
        )

        Book.objects.create(
            id=1,
            book_id="B001",
            name="Python",
            total_quantity=10,
            description="Test",
            category=category,
            author=author,
            publisher=publisher
        )

        data_form = {
            "book_id": "B002",
            "name": "Python Update",
            "total_quantity": 20,
            "description": "Updated",
            "active": True,
            "category_id": category.id,
            "author_id": author.id,
            "publisher_id": publisher.id
        } if method in ["post", "put", "patch"] else {}

        response = getattr(client, method)(
            url,
            data=data_form,
            format='json'
        )

        if method == "delete" and expected == 200:
            assert response.status_code in [200, 204]
        else:
            assert response.status_code == expected