from django.test import TestCase
# Create your tests here.
from rest_framework.test import APITestCase
from django.urls import reverse, get_resolver
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import *
from django.db import IntegrityError

User = get_user_model()  # Lấy đúng model đang dùng

# class CategoryAPITest(APITestCase):
#     def setUp(self):
#         self.admin = User.objects.create_user(username='admin', password='123')
#         self.url = reverse('categories-list') # Ví dụ tên route DRF router
#     # def test_create_category(self):
#     #     self.client.force_authenticate(user=self.admin)
#     #     data = {'name': 'Test Category'}
#     #     response = self.client.post(self.url, data)
        
#     #     # Kiểm tra response
#     #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
#     #     # Kiểm tra DB (có thể kiểm tra nếu muốn)
#     #     self.assertTrue(Category.objects.filter(name='Test Category').exists())
        
#     def test_delete_category(self):
#         self.client.force_authenticate(user=self.admin)  
#         category = Category.objects.create(name='Test Category')
#         detail_url = reverse('categories-detail', args=[category.id])
#         response = self.client.delete(detail_url)
        
#         self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
#         self.assertFalse(Category.objects.filter(id=category.id).exists())
        
    
    
class EmployeeModelTest(TestCase):
    def setUp(self):
        # Tạo sẵn một user mẫu
        self.user = User.objects.create_user(username='staff1', password='123')

    def test_employee_link_to_user(self):
        """Kiểm tra Employee được tạo thành công và liên kết đúng User"""
        employee = Employee.objects.create(
            user=self.user,
            employee_id="EMP001",
            shift="Morning",
            identity_card="123456789"
        )
        
        # Kiểm tra truy vấn ngược từ user sang employee
        self.assertEqual(self.user.employee.employee_id, "EMP001")
        # Kiểm tra truy vấn xuôi
        self.assertEqual(employee.user.username, "staff1")

    def test_one_to_one_constraint(self):
        """Kiểm tra ràng buộc 1-1: Một User không thể có 2 Employee record"""
        # Tạo employee thứ nhất
        Employee.objects.create(
            user=self.user, 
            employee_id="EMP001", 
            shift="Morning"
        )
        
        # Thử tạo employee thứ hai với CÙNG một user đó
        with self.assertRaises(IntegrityError):
            Employee.objects.create(
                user=self.user, 
                employee_id="EMP002", 
                shift="Evening"
            )
            
            