import pytest
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from library_management.models import User

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def normal_user(db):
    return User.objects.create_user(
        username='member',
        password='password123'
    )

@pytest.fixture
def staff_user(db):
    return User.objects.create_user (
        username="staff",
        password="staff123",
        is_staff=True
    )
    
@pytest.fixture
def admin_user(db):
    return User.objects.create_superuser(
        username='admin',
        password='password123'
    )

@pytest.fixture
def auth_client(api_client, normal_user):
    token, _ = Token.objects.get_or_create(user=normal_user)
    api_client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    return api_client

@pytest.fixture
def auth_admin(api_client, admin_user):
    token, _ = Token.objects.get_or_create(user=admin_user)
    api_client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    return api_client

@pytest.fixture
def auth_staff(api_client, staff_user):
    token, _ = Token.objects.get_or_create(user=staff_user)
    api_client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
    return api_client


