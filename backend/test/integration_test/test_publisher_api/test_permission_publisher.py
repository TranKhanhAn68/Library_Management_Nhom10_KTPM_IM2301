import pytest
from library_management.models import Publisher
from test.integration_test.helpers import generate_permissions_matrix

@pytest.mark.django_db
class TestPublisherPermissions:

    @pytest.mark.parametrize(
        "method, url, user_fixture, expected",
        generate_permissions_matrix("/publishers/")
    )
    def test_all_permissions_publisher(self, request, method, url, user_fixture, expected):

        client = request.getfixturevalue(user_fixture)

        # setup publisher id=1
        Publisher.objects.create(
            id=1,
            name="NXB A"
        )

        data_form = {
            "name": "Updated Publisher"
        } if method in ["post", "put", "patch"] else {}

        response = getattr(client, method)(
            url,
            data=data_form,
            format='json'
        )

        # fix delete 204
        if method == "delete" and expected == 200:
            assert response.status_code in [200, 204]
        else:
            assert response.status_code == expected