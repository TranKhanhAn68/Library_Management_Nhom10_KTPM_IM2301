import pytest

from library_management.models import Category
from test.integration_test.helpers import generate_permissions_matrix


@pytest.mark.django_db
class TestCategoryPermissions:

    @pytest.mark.parametrize(
        "method, url, user_fixture, expected",
        generate_permissions_matrix("/categories/")
    )
    def test_all_permissions_category(
        self,
        request,
        method,
        url,
        user_fixture,
        expected
    ):

        client = request.getfixturevalue(user_fixture)

        # tạo category test
        category = Category.objects.create(
            name="Test Category"
        )

        # replace URL detail
        if "/1/" in url:
            url = url.replace(
                "/1/",
                f"/{category.id}/"
            )

        data_form = {
            "name": "Refactoring"
        } if method in ["post", "put", "patch"] else {}

        response = getattr(
            client,
            method
        )(
            url,
            data=data_form
        )

        if method == "delete" and user_fixture == "auth_admin":
            assert response.status_code == 204
        else:
            assert response.status_code == expected