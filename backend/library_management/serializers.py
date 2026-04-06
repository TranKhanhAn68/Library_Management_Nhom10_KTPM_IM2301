from rest_framework import serializers
from .models import *
import re
from django.contrib.auth import authenticate
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
        fields = "__all__"
        

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
        data = super().to_representation(instance)
        if instance.image:
            data['image'] = instance.image.url
            print(data['image'])
        return data
    
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password') 
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    image = serializers.ImageField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    
    def validate(self, data):
        user = authenticate(
            username=data['username'],
            password=data['password']
        )
        
        if not user:
            raise serializers.ValidationError("Sai tài khoản hoặc mật khẩu")
        
        data['user'] = user
        return data
    
    # def to_representation(self, instance):
    #     data = super().to_representation(instance)
    #     if instance.image:
    #         data['image'] = instance.image.url
    #     else:
    #         data['image'] = None
    #     return {
    #         'username': data['username'],
    #         'email': data['email'],
    #         'image': data['image'],
    #         'first_name': data['first_name'],
    #         'last_name': data['last_name']
    #     }
    
    
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only =True)
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']
    
    
    def validate_username(self, value):
        if not re.match(r'^[A-Za-z][0-9A-Za-z]{5,15}$', value):
            raise serializers.ValidationError( 
                 "Username chỉ có nhiều hơn 6 ký tự và bao gồm cả chữ, số"
            )        
        return value
    
    def validate_password(self, value):
        if not re.match(r'^[A-Za-z](?=.*?[0-9])(?=.*?[A-Za-z]).{8,24}$', value):
            raise serializers.ValidationError(
                "Password phải >=8 ký tự, gồm chữ và số"
            )
        return value
        
    def validate_email(self, value):
        if not re.match(r'^\S+@\S+\.\S+$', value):
            raise serializers.ValidationError(
                "Sai định dạng email"
            )
        return value
    
    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        
        user.save()
        return user
    
    
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
        
class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = "__all__"
        