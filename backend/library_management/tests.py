from django.test import TestCase
# Create your tests here.
from rest_framework.test import APITestCase
from django.urls import reverse, get_resolver
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Category

User = get_user_model()  # Lấy đúng model đang dùng

class CategoryAPITest(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='123')
        self.url = reverse('categories-list') # Ví dụ tên route DRF router
    # def test_create_category(self):
    #     self.client.force_authenticate(user=self.admin)
    #     data = {'name': 'Test Category'}
    #     response = self.client.post(self.url, data)
        
    #     # Kiểm tra response
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    #     # Kiểm tra DB (có thể kiểm tra nếu muốn)
    #     self.assertTrue(Category.objects.filter(name='Test Category').exists())
        
    def test_delete_category(self):
        self.client.force_authenticate(user=self.admin)  
        category = Category.objects.create(name='Test Category')
        detail_url = reverse('categories-detail', args=[category.id])
        response = self.client.delete(detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Category.objects.filter(id=category.id).exists())
        
    