from rest_framework import serializers
from .models import *
import re
from django.contrib.auth import authenticate
from django.db import transaction
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
    name = serializers.CharField(required=True, allow_blank=False)
    class Meta:
        model = Category
        fields = '__all__'
        
    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Tên không được rỗng")
        return value
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        if request and not request.user.is_staff:
            fields_to_hide = ['created_at', 'updated_at']
            
            for filed in fields_to_hide:
                data.pop(filed, None)
        return data
        
class AuthorSerializer(ItemSerializer):
    class Meta:
        model = Author
        fields = "__all__"
        
class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = "__all__"

class SimpleBookSerializer(ItemSerializer):
    class Meta:
        model = Book
        fields = ['name', 'image']
        
class BookSerializer(ItemSerializer):
    author = AuthorSerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    
    author_id = serializers.IntegerField()
    publisher_id = serializers.IntegerField()
    category_id = serializers.IntegerField()
    
    available_quantity = serializers.SerializerMethodField()
    class Meta:
        model = Book
        fields = '__all__'
    
    def create(self, validated_data):
        category_id = validated_data.pop('category_id')
        author_id = validated_data.pop('author_id')
        publisher_id = validated_data.pop('publisher_id')
        
        return Book.objects.create(
            category_id = category_id,
            author_id = author_id,
            publisher_id=publisher_id,
            **validated_data   
        )
    
    def get_available_quantity(self, obj):
        return obj.available_quantity()
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        request = self.context.get('request')
        
        if request and not request.user.is_staff:
            fields_to_hide = ['created_at', 'updated_at', 'total_quantity']
            
            for filed in fields_to_hide:
                data.pop(filed, None)
        return data
        
        

class BorrowSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Book
        fields = "__all__"
        
class SimpleUserSerializer(ItemSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'image']
        
class UserSerializer(ItemSerializer):
    class Meta:
        model = User
        fields = "__all__"
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
        
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
        password = validated_data.pop('password', None) 
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
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
    
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
    
    

        
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"
        
class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = "__all__"
    
        
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model= Reservation
        fields = ['book', 'user']
        extra_kwargs = {
            'user': {
                'read_only': True
            }
        }
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        data['user'] = SimpleUserSerializer(instance.user).data
        data['book'] = SimpleBookSerializer(instance.book).data
        return data
        
class CartItemSerializer(serializers.ModelSerializer):
    book_id = serializers.IntegerField(source='book', write_only=True)
    setting = serializers.DictField(write_only=True)

    class Meta:
        model = User_Book
        fields = ['book_id', 'borrowing_quantity', 'price', 'setting']

    def create(self, validated_data):
        book_id = validated_data.pop('book')
        qty = validated_data.get('borrowing_quantity') 
        price = validated_data.get('price', 0)
        setting_data = validated_data.pop('setting')

        borrowing = User_Book.objects.create(
            user=self.context['request'].user,
            book_id=book_id,
            borrowing_quantity=qty,
            price=price
        )

        User_Book_Detail_Fine.objects.create(
            user_book=borrowing,
            setting_id=setting_data.get('id')
        )
        return borrowing
        
class BorrowingDetailCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Book_Detail_Fine
        fields = '__all__'
        

