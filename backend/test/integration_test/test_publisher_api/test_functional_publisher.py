import pytest
from library_management.models import Publisher

@pytest.mark.django_db
class TestPublisherAPI:

    def test_create_publisher(self, auth_admin):
        client = auth_admin

        response = client.post('/publishers/', {
            'name': 'NXB A'
        })

        assert response.status_code == 201
        assert Publisher.objects.filter(name='NXB A').exists()

    def test_get_object_publisher(self, auth_admin):
        publisher = Publisher.objects.create(id=1, name='NXB A')

        client = auth_admin
        response = client.get('/publishers/1/')

        assert response.status_code == 200
        assert response.data['name'] == publisher.name

    def test_get_list_publisher_with_admin(self, auth_admin):
        Publisher.objects.create(id=1, name='NXB A')
        Publisher.objects.create(id=2, name='NXB B')
        Publisher.objects.create(id=3, name='NXB C')

        client = auth_admin
        response = client.get('/publishers/')

        assert response.status_code == 200
        assert len(response.data) == 3

    def test_patch_publisher(self, auth_admin):
        Publisher.objects.create(id=1, name='NXB A')

        client = auth_admin
        response = client.patch('/publishers/1/', {
            'name': 'NXB Updated'
        })

        assert response.status_code == 200
        assert Publisher.objects.get(id=1).name == 'NXB Updated'

    def test_delete_publisher(self, auth_admin):
        Publisher.objects.create(id=1, name='NXB A')

        client = auth_admin
        response = client.delete('/publishers/1/')

        assert response.status_code == 204
        assert not Publisher.objects.filter(id=1).exists()