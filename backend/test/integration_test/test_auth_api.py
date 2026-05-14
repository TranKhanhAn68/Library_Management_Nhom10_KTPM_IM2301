import pytest


@pytest.mark.django_db
class TestAuthAPI:

    def test_register_user(self, api_client):
        response = api_client.post(
            "/account/register/",
            {
                "username": "newuser",
                "password": "password123",
                "email": "new@gmail.com",
                "first_name": "Nguyen",
                "last_name": "An",
            },
        )
        assert response.status_code == 201

    def test_login_success(self, api_client, normal_user):
        response = api_client.post(
            "/account/login/", {"username": "member", "password": "password123"}
        )
        assert response.status_code == 200
        assert "token" in response.data

    def test_login_failed(self, api_client, normal_user):
        response = api_client.post(
            "/account/login/", {"username": "mem", "password": "password123"}
        )
        assert response.status_code == 400
