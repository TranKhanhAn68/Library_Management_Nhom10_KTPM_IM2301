import pytest
from library_management.models import User

@pytest.mark.django_db
class TestUserAPI:

    def test_create_user(self, auth_admin):

        client = auth_admin

        response = client.post(
            '/users/',
            {
                'username': 'member1',
                'password': 'khanhanbikhung01',
                'email': 'member1@gmail.com',
                'first_name': 'Nguyen',
                'last_name': 'Van A'
            },
            format='json'
        )

        print(response.data)

        assert response.status_code in [200, 201]
        assert User.objects.filter(username='member1').exists()


    def test_get_object_user(self, auth_admin):

        user = User.objects.create_user(
            username='member1',
            password='123456',
            email='member1@gmail.com'
        )

        client = auth_admin

        response = client.get(f'/users/{user.id}/')

        assert response.status_code == 200
        assert response.data['username'] == user.username


    def test_get_list_user_with_admin(self, auth_admin):

        User.objects.create_user(
            username='user1',
            password='123'
        )

        User.objects.create_user(
            username='user2',
            password='123'
        )

        User.objects.create_user(
            username='user3',
            password='123'
        )

        client = auth_admin

        response = client.get('/users/')

        print(response.data)

        assert response.status_code == 200


    def test_patch_user(self, auth_admin):

        user = User.objects.create_user(
            username='member1',
            password='123456',
            email='member1@gmail.com'
        )

        client = auth_admin

        response = client.patch(
            f'/users/{user.id}/',
            {
                'first_name': 'Updated'
            },
            format='json'
        )

        print(response.data)

        assert response.status_code == 200
        assert User.objects.get(id=user.id).first_name == 'Updated'


    def test_delete_user(self, auth_admin):

        user = User.objects.create_user(
            username='member1',
            password='123456'
        )

        client = auth_admin

        response = client.delete(f'/users/{user.id}/')

        assert response.status_code in [200, 204]
        assert not User.objects.filter(id=user.id).exists()


    def test_search_user_by_name(self, auth_admin):

        User.objects.create_user(
        username='ngan',
        first_name='Nguyen',
        last_name='Ngan',
        password='123456'
    )

        User.objects.create_user(
        username='an',
        first_name='Tran',
        last_name='An',
        password='123456'
    )

        client = auth_admin

        response = client.get(
        '/users/?search=ngan'
    )

        assert response.status_code == 200

        usernames = [
        user['username']
        for user in response.data['results']
    ]

        assert 'ngan' in usernames