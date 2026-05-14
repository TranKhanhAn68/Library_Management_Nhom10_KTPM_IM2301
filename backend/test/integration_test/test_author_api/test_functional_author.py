from unicodedata import category
from urllib import response
from xmlrpc import client

import pytest
from library_management.models import Author, Book, Category, Publisher

@pytest.mark.django_db
class TestAuthorAPI:

    def test_create_author(self, auth_admin):
        client = auth_admin

        response = client.post('/authors/', {
            'name': 'Author A',
            'date_of_birth': '2000-01-01',
            'biography': 'Bio'
        })

        assert response.status_code == 201
        assert Author.objects.filter(name='Author A').exists()

    def test_get_object_author(self, auth_admin):
        author = Author.objects.create(
            id=1,
            name='Author A',
            date_of_birth='2000-01-01',
            biography='Bio'
        )

        client = auth_admin
        response = client.get('/authors/1/')

        assert response.status_code == 200
        assert response.data['name'] == author.name

    def test_get_list_author_with_admin(self, auth_admin):
        Author.objects.create(
            id=1,
            name='Author A',
            date_of_birth='2000-01-01',
            biography='Bio'
        )

        Author.objects.create(
            id=2,
            name='Author B',
            date_of_birth='2001-01-01',
            biography='Bio'
        )

        Author.objects.create(
            id=3,
            name='Author C',
            date_of_birth='2002-01-01',
            biography='Bio'
        )

        client = auth_admin
        response = client.get('/authors/')

        assert response.status_code == 200
        assert len(response.data) == 3

    def test_patch_author(self, auth_admin):
        Author.objects.create(
            id=1,
            name='Author A',
            date_of_birth='2000-01-01',
            biography='Bio'
        )

        client = auth_admin

        response = client.patch('/authors/1/', {
            'name': 'Updated Author'
        })

        assert response.status_code == 200
        assert Author.objects.get(id=1).name == 'Updated Author'

    def test_delete_author(self, auth_admin):
        Author.objects.create(
            id=1,
            name='Author A',
            date_of_birth='2000-01-01',
            biography='Bio'
        )

        client = auth_admin

        response = client.delete('/authors/1/')

        assert response.status_code == 204
        assert not Author.objects.filter(id=1).exists()

    def test_search_book_by_author_name(self, auth_admin):

        author1 = Author.objects.create(
        name='Author A',
        date_of_birth='2000-01-01',
        biography='Bio'
    )

        author2 = Author.objects.create(
        name='Author B',
        date_of_birth='2001-01-01',
        biography='Bio'
    )

        category = Category.objects.create(name="IT")

        publisher = Publisher.objects.create(name="NXB")

        Book.objects.create(
        book_id='B001',
        name='Python',
        total_quantity=10,
        category=category,
        author=author1,
        publisher=publisher
    )

        Book.objects.create(
        book_id='B002',
        name='Java',
        total_quantity=10,
        category=category,
        author=author2,
        publisher=publisher
    )

        client = auth_admin

        response = client.get(
        '/books/?author_name=Author A'
    )

        assert response.status_code == 200