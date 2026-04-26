import pytest
from library_management.models import *
from test.integration_test.helpers import generate_permissions_matrix

@pytest.mark.django_db
class TestCategoryPermissions:

    @pytest.mark.parametrize(
        "method, url, user_fixture, expected",
        generate_permissions_matrix("/categories/")
    )
    def test_all_permissions_category(self, request, method, url, user_fixture, expected):
        client = request.getfixturevalue(user_fixture)

        data_form = {"name": "Refactoring"} if method in ["post", "put", "patch"] else {}

        response = getattr(client, method)(url, data=data_form)
    
        assert response.status_code == expected