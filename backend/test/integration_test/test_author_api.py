import pytest
from library_management.models import Author

@pytest.mark.django_db
class TestAuthorPermission:

    @pytest.mark.parametrize("user_fixture,expected", [
        ("api_client", 3),
        ("auth_client", 3),
        ("auth_admin", 3),
    ])
    def test_get_list_author(self, request, user_fixture, expected):
        user = request.getfixturevalue(user_fixture)

        Author.objects.create(
            name="Author A",
            date_of_birth="2000-01-01",
            biography="Bio"
        )

        Author.objects.create(
            name="Author B",
            date_of_birth="2001-01-01",
            biography="Bio"
        )

        Author.objects.create(
            name="Author C",
            date_of_birth="2002-01-01",
            biography="Bio"
        )

        response = user.get("/authors/")

        assert response.status_code == 200
        assert len(response.data) == expected

    @pytest.mark.parametrize("user_fixture,expected_keys", [
        ("api_client", ["id", "name"]),
        ("auth_client", ["id", "name"]),
        ("auth_admin", ["id", "name", "date_of_birth", "biography"]),
    ])
    def test_get_object_author(self, request, user_fixture, expected_keys):
        user = request.getfixturevalue(user_fixture)

        author = Author.objects.create(
            name="Author A",
            date_of_birth="2000-01-01",
            biography="Bio"
        )

        response = user.get(f"/authors/{author.id}/")

        assert response.status_code == 200

        for key in expected_keys:
            assert key in response.data