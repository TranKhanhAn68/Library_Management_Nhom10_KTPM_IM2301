import pytest
from rest_framework.test import APIClient
from library_management.models import *

@pytest.mark.django_db
class TestSettingPermission:

    def test_client_cannot_create_setting(self):

        client = APIClient()

        user = User.objects.create_user(
            username="client_setting",
            password="123"
        )

        client.force_authenticate(user=user)

        response = client.post(
            "/settings/",
            {
                "borrowing_days": 7,
                "borrowing_fee": 1000,
                "borrowing_overdue_fine": 500
            },
            format="json"
        )

        assert response.status_code in [401, 403]


    def test_admin_can_create_setting(self):

        client = APIClient()

        admin = User.objects.create_superuser(
            username="admin_setting_permission",
            password="123"
        )

        client.force_authenticate(user=admin)

        response = client.post(
            "/settings/",
            {
                "borrowing_days": 7,
                "borrowing_fee": 1000,
                "borrowing_overdue_fine": 500
            },
            format="json"
        )

        assert response.status_code in [200, 201]