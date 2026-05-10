import pytest
from library_management.models import *
from rest_framework.test import APIClient

@pytest.mark.django_db
class TestSettingAPI:

    def test_create_setting(self):

        client = APIClient()

        admin = User.objects.create_superuser(
            username="admin_setting",
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


    def test_get_list_setting(self):

        client = APIClient()

        admin = User.objects.create_superuser(
            username="admin_setting_2",
            password="123"
        )

        client.force_authenticate(user=admin)

        Setting.objects.create(
            borrowing_days=7,
            borrowing_fee=1000,
            borrowing_overdue_fine=500
        )

        response = client.get("/settings/")

        assert response.status_code == 200


    def test_update_setting(self):

        client = APIClient()

        admin = User.objects.create_superuser(
            username="admin_setting_3",
            password="123"
        )

        client.force_authenticate(user=admin)

        setting = Setting.objects.create(
            borrowing_days=7,
            borrowing_fee=1000,
            borrowing_overdue_fine=500
        )

        response = client.put(
            f"/settings/{setting.id}/",
            {
                "borrowing_days": 10,
                "borrowing_fee": 2000,
                "borrowing_overdue_fine": 1000,
                "active": True
            },
            format="json"
        )

        assert response.status_code == 200