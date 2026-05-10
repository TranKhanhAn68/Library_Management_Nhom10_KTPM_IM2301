import pytest
from library_management.models import *
from rest_framework.test import APIClient

@pytest.mark.django_db
class TestSettingFunctional:

    @pytest.mark.parametrize(
    "method, url, is_admin, expected",
    [
        ("get", "/settings/", False, 200),
        ("get", "/settings/", True, 200),

        ("post", "/settings/", False, 403),
        ("post", "/settings/", True, 201),

        ("put", "/settings/1/", False, 403),
        ("put", "/settings/1/", True, 200),

        ("delete", "/settings/1/", False, 403),
        ("delete", "/settings/1/", True, 200),
    ]
)
    def test_all_permissions_setting(
        self,
        method,
        url,
        is_admin,
        expected
    ):

        client = APIClient()

        if is_admin:
            user = User.objects.create_superuser(
                username=f"admin_{method}",
                password="123"
            )
        else:
            user = User.objects.create_user(
                username=f"user_{method}",
                password="123"
            )

        client.force_authenticate(user=user)

        setting = Setting.objects.create(
            borrowing_days=7,
            borrowing_fee=1000,
            borrowing_overdue_fine=500
        )

        if "/1/" in url:
            url = url.replace(
                "/1/",
                f"/{setting.id}/"
            )

        data = {
            "borrowing_days": 10,
            "borrowing_fee": 2000,
            "borrowing_overdue_fine": 1000,
            "active": True
        }

        response = getattr(client, method)(
            url,
            data=data,
            format="json"
        )

        # delete thường trả 204
        if method == "delete" and is_admin:
            assert response.status_code in [200, 204]
        else:
            assert response.status_code == expected