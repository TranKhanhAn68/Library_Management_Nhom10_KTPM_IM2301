from rest_framework import serializers
from .models import *

# class UserSerializer(serializers.ModelSerializer):
#     class Meta: 
#         model = User
#         fields = '__all__'

class ItemSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.image:
            data['image'] = instance.image.url
        return data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
class BookSerializer(ItemSerializer):
    class Meta:
        model = Book
        fields = ['book_id', 'name', 'total_quantity', 'available_quantity', 'image', 'category', 'author', 'publisher', 'description']
        

class BorrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Book
        fields = "__all__"
        
class UserSerializer(ItemSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password', 'image']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
        
    def to_representation(self, instance):
        data =  super().to_representation(instance)
        if instance.image:
            data['image'] = instance.image.url
        return data
    
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)  # Lấy password nếu có
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)  # Hash password trước khi lưu
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
class AuthorSerializer(ItemSerializer):
    class Meta:
        model = Author
        fields = "__all__"
        
class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = "__all__"
        
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"
        