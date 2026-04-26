import pytest
from library_management.models import *
from test.integration_test.helpers import *
from datetime import datetime
@pytest.mark.django_db
class TestCategoryPermission:
    @pytest.mark.parametrize("user_fixture,expected", [
        ("api_client", 2),
        ("auth_client", 2),
        ("auth_admin", 3),
    ])
    def test_get_list_category(self, request, user_fixture, expected):
        user = request.getfixturevalue(user_fixture)

        response = assert_active_filter(
            user,
            "/categories/",
            Category,
            [
                {"name": "A", "active": True},
                {"name": "B", "active": False},
                {"name": "C", "active": True}
            ]
        )

        assert len(response.data) == expected
        
    @pytest.mark.parametrize("user_fixture,expected_keys", [
        ("api_client", ["id", "name"]),
        ("auth_client", ["id", "name"]),
        ("auth_admin", ["id", "name", "active", "created_at", "updated_at"]),
    ])
    def test_get_object_category(self, request, user_fixture, expected_keys):
        user = request.getfixturevalue(user_fixture)

        category = Category.objects.create(name="A", active=True)

        response = user.get(f"/categories/{category.id}/")

        assert response.status_code == 200

        for key in expected_keys:
            assert key in response.data
            
    
