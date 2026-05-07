import pytest
from library_management.models import Author
from test.integration_test.helpers import generate_permissions_matrix

@pytest.mark.django_db
class TestAuthorPermissions:

    @pytest.mark.parametrize(
        "method, url, user_fixture, expected",
        generate_permissions_matrix("/authors/")
    )
    def test_all_permissions_author(self, request, method, url, user_fixture, expected):

        client = request.getfixturevalue(user_fixture)

        # setup author id=1
        Author.objects.create(
            id=1,
            name="Author A",
            date_of_birth="2000-01-01",
            biography="Bio"
        )

        data_form = {
            "name": "Updated Author",
            "date_of_birth": "2000-01-01",
            "biography": "Updated Bio"
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