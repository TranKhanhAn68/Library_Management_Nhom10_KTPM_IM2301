import pytest
from library_management.models import Publisher

@pytest.mark.django_db
class TestPublisherPermission:

    @pytest.mark.parametrize("user_fixture,expected", [
        ("api_client", 3),
        ("auth_client", 3),
        ("auth_admin", 3),
    ])
    def test_get_list_publisher(self, request, user_fixture, expected):
        user = request.getfixturevalue(user_fixture)

        Publisher.objects.create(name="NXB A")
        Publisher.objects.create(name="NXB B")
        Publisher.objects.create(name="NXB C")

        response = user.get("/publishers/")

        assert response.status_code == 200
        assert len(response.data) == expected

    @pytest.mark.parametrize("user_fixture,expected_keys", [
        ("api_client", ["id", "name"]),
        ("auth_client", ["id", "name"]),
        ("auth_admin", ["id", "name"]),
    ])
    def test_get_object_publisher(self, request, user_fixture, expected_keys):
        user = request.getfixturevalue(user_fixture)

        publisher = Publisher.objects.create(name="NXB A")

        response = user.get(f"/publishers/{publisher.id}/")

        assert response.status_code == 200

        for key in expected_keys:
            assert key in response.data