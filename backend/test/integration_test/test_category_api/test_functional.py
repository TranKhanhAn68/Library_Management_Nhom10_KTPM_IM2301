from urllib import response

import pytest
from library_management.models import Author, Book, Category, Publisher

@pytest.mark.django_db
class TestCategoryAPI:
    def test_create_category(self, auth_admin):
        client = auth_admin

        response = client.post('/categories/', {
            'name': 'Dev'
        })

        assert response.status_code == 201
        assert Category.objects.filter(name='Dev').exists()
        
    def test_get_object_category(self, auth_admin):
        cate = Category.objects.create(id=1, name='Dev')

        client = auth_admin
        response = client.get('/categories/1/')
        assert response.status_code == 200
        assert response.data['name'] == cate.name

    def test_get_list_category_with_admin(self, auth_admin):
        Category.objects.create(id=1, name='Dev')
        Category.objects.create(id=2, name='DevOps', active=False)
        Category.objects.create(id=3, name='Tester')
        
        client = auth_admin
        response = client.get('/categories/')
        assert response.status_code == 200
        assert len(response.data) == 3
        
    # Nếu không phải superuser thì chỉ lấy active=True
    def test_get_list_category_with_no_admin(self, auth_staff):
        Category.objects.create(id=1, name='Dev')
        Category.objects.create(id=2, name='DevOps', active=False)
        Category.objects.create(id=3, name='Tester')
        
        client = auth_staff
        response = client.get('/categories/')
        assert response.status_code == 200
        assert len(response.data) == 2
        
    def test_patch_category(self, auth_admin):
        Category.objects.create(id=1, name='Dev')
        client = auth_admin
        response = client.patch('/categories/1/', {
            'active': False
        })
        assert response.status_code == 200
        assert Category.objects.get(id=1).active is False   
             
    def test_delete_category(self, auth_admin):
        Category.objects.create(id=1, name='Dev')
        client = auth_admin
        response = client.delete('/categories/1/')
        assert response.status_code == 204        
        assert not Category.objects.filter(id=1).exists()

    def test_search_book_by_category(self, auth_admin):

        category1 = Category.objects.create(
        id=1,
        name='Dev'
    )

        category2 = Category.objects.create(
        id=2,
        name='Tester'
    )

        author = Author.objects.create(
        name='Author A',
        date_of_birth='2000-01-01',
        biography='Bio'
    )

        publisher = Publisher.objects.create(
        name='NXB A'
    )

        Book.objects.create(
        book_id='B001',
        name='Python',
        total_quantity=10,
        category=category1,
        author=author,
        publisher=publisher
    )

        Book.objects.create(
        book_id='B002',
        name='Java',
        total_quantity=10,
        category=category2,
        author=author,
        publisher=publisher
    )

        client = auth_admin

        response = client.get(
        '/books/?category_name=Dev'
    )

        assert response.status_code == 200
        assert response.data['count'] == 2
        