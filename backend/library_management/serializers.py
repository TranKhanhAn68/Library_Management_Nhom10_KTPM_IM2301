from rest_framework import serializers
from .models import *
import re
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.db import transaction
from library_management.services import validator
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
    def create(self, validated_data):
        name = validated_data.get("name")
        validator.validate_unique_name(Category, name, "Category name đã tồn tại!")
        return super().create(validated_data)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        if request and not request.user.is_superuser:
            fields_to_hide = ['created_at', 'updated_at', "active"]
            
            for filed in fields_to_hide:
                data.pop(filed, None)
        return data
        
from django.utils import timezone
from rest_framework import serializers

class AuthorSerializer(ItemSerializer):
    class Meta:
        model = Author
        fields = "__all__"

    def create(self, validated_data):
        name = validated_data.get("name")
        validator.validate_unique_name(Author, name, "Author name đã tồn tại!")
        return super().create(validated_data)

    def validate_date_of_birth(self, value):
        today = timezone.now().date()

        if value > today:
            raise serializers.ValidationError(
                "Ngày sinh không được lớn hơn ngày hiện tại!"
            )

        return value

    def validate(self, attrs):
        date_of_birth = attrs.get("date_of_birth")
        date_of_death = attrs.get("date_of_death")

        if (
            date_of_birth and
            date_of_death and
            date_of_death < date_of_birth
        ):
            raise serializers.ValidationError({
                "date_of_death": "Ngày mất không được nhỏ hơn ngày sinh!"
            })

        return attrs

        
class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = "__all__"
        
    def create(self, validated_data):
        name = validated_data.get("name")
        validator.validate_unique_name(Publisher, name, "Publisher name đã tồn tại!")
        return super().create(validated_data)

class SimpleBookSerializer(ItemSerializer):
    borrow_count = serializers.IntegerField(read_only=True)
    class Meta:
        model = Book
        fields = ['name', 'image', 'borrow_count']
        
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
        name = validated_data.get("name")
        book_id = validated_data.get("book_id")
        category_id = validated_data.pop('category_id')
        author_id = validated_data.pop('author_id')
        publisher_id = validated_data.pop('publisher_id')
        validator.validate_unique_name(Book, name, "Book name đã tồn tại!")
        validator.validate_unique_book_id(Book, book_id, "Book Code đã được định danh!")
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
        
from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import User


class SimpleUserSerializer(serializers.ModelSerializer):
    phone_regex = RegexValidator(
        regex=r'^\d{9,11}$',
        message="Số điện thoại phải từ 9 đến 11 chữ số"
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'is_active',
            'first_name',
            'last_name',
            'image',
            'phone_number',
            'gender',
            'dob',
            'is_superuser',
            'is_staff'
        ]

    def to_representation(self, instance):
        request = self.context.get("request")
        data = super().to_representation(instance)
        data["image"] = instance.image.url if instance.image else None
        user = request.user if request else None
        is_admin = user and (user.is_staff or user.is_superuser)
        if not is_admin:
            data.pop("is_superuser", None)
            data.pop("is_staff", None)
        return data
    
    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Họ không được để trống")
        return value

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Tên không được để trống")
        return value

    def validate_phone_number(self, value):
        self.phone_regex(value)
        return value

    def validate_gender(self, value):
        allowed = ["Nam", "Nữ", "Khác"]
        if value not in allowed:
            raise serializers.ValidationError("Giới tính không hợp lệ")
        return value

    def validate_image(self, value):
        if value:
            if value.size > 2* 1024 * 1024:
                raise serializers.ValidationError("Ảnh tối đa 2MB")
        return value
        
class UserSerializer(serializers.ModelSerializer):

    employee_id = serializers.CharField(write_only=True, required=False)
    shift = serializers.CharField(write_only=True, required=False)
    identity_card = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = SimpleUserSerializer.Meta.model

        fields = SimpleUserSerializer.Meta.fields + [
            'id',
            'password',
            'last_login',
            'date_joined',

            'employee_id',
            'shift',
            'identity_card',
        ]

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

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.image:
            data['image'] = instance.image.url

        return data

    def create(self, validated_data):
        username = validated_data.get("username")
        email = validated_data.get("email")
        employee_id = validated_data.pop('employee_id', None)
        shift = validated_data.pop('shift', None)
        identity_card = validated_data.pop('identity_card', None)
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username đã tồn tại")
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError(  
                "Email đã tồn tại"
            )            
        user = User(**validated_data)
        user.set_password(validated_data['password'])
        user.save()
        if employee_id and shift and identity_card:
            Employee.objects.create(
                user=user,
                employee_id=employee_id,
                shift=shift,
                identity_card=identity_card
            )

        return user

    def update(self, instance, validated_data):

        password = validated_data.pop('password', None)

        employee_id = validated_data.pop('employee_id', None)
        shift = validated_data.pop('shift', None)
        identity_card = validated_data.pop('identity_card', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if instance.is_staff:

            employee, created = Employee.objects.get_or_create(
                user=instance
            )

            employee.employee_id = employee_id
            employee.shift = shift
            employee.identity_card = identity_card

            employee.save()

        return instance
    
class SimpleSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Setting
        fields = ['borrowing_days', 'borrowing_fee', 'borrowing_overdue_fine']

class SettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SimpleSettingSerializer.Meta.model
        fields = SimpleSettingSerializer.Meta.fields + ['id', 'active']
    def validate_borrowing_days(self, value):
        if Setting.objects.filter(borrowing_days=value).exists():
            raise serializers.ValidationError(
                "Đã tồn tại Setting với số ngày này không thể tạo thêm!"
            )
        return value
    def create(self, validated_data):
        if str(validated_data.get('borrowing_days', '')).strip() == '':
            raise serializers.ValidationError('Số ngày mượn là bắt buộc')

        if str(validated_data.get('borrowing_fee', '')).strip() == '':
            raise serializers.ValidationError('Phí mượn là bắt buộc')

        if str(validated_data.get('borrowing_overdue_fine', '')).strip() == '':
            raise serializers.ValidationError('Tiền phạt quá hạn là bắt buộc')


        return super().create(validated_data)
        

class BorrowingDetailCartSerializer(serializers.ModelSerializer):
    setting = SimpleSettingSerializer(read_only=True)
    class Meta:
        model = User_Book_Detail_Fine
        fields = ['late_dates', 'setting']
        

class BorrowSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)
    book = SimpleBookSerializer(read_only=True)
    fine = BorrowingDetailCartSerializer(source="user_book_detail_fine", read_only=True)
    class Meta:
        model = User_Book
        fields = "__all__"

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(read_only=True)
    first_name = serializers.CharField(read_only=True)
    last_name = serializers.CharField(read_only=True)
    image = serializers.ImageField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)
    
    def validate(self, data):
        username = data.get('username', '').strip()
        password = data.get('password', '').strip()
        if not username or not password:
            raise AuthenticationFailed("Không được bỏ trống")
        
        user = authenticate(
            username=data['username'],
            password=data['password']
        )
        
        if not user:
            raise AuthenticationFailed("Sai tài khoản hoặc mật khẩu")
        if not user.is_active:
            raise AuthenticationFailed("Tài khoản bị khóa")
        
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
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }
    
    def validate(self, data):
        required_fields = ["username", "email", "password", "first_name", "last_name"]

        for field in required_fields:
            value = data.get(field)
            if not value or not str(value).strip():
                raise serializers.ValidationError("Vui lòng điền đầy đủ thông tin đăng ký")
        return data
    
    def validate_username(self, value):
        username = value
        if not re.match(r'^[A-Za-z][0-9A-Za-z]{5,15}$', username):
            raise serializers.ValidationError( 
                 "Username chỉ có nhiều hơn 6 ký tự và bao gồm cả chữ, số"
            )
            
        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError("Username đã tồn tại")
        return value
    
    def validate_password(self, value):
        password = value
        if not re.match(r'^[A-Za-z](?=.*?[0-9])(?=.*?[A-Za-z]).{8,24}$', password):
            raise serializers.ValidationError(
                "Password phải >=8 ký tự, gồm chữ và số"
            )
        return value
        
    def validate_email(self, value):
        email = value
        if not re.match(r'^\S+@\S+\.\S+$', email):
            raise serializers.ValidationError(
                "Sai định dạng email"
            )
        
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError("Email đã tồn tại")
        return value
    
    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(user.password)
        
        user.save()
        return user
    
class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"  
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
        
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    
    def validate_old_password(self, value):
        user = self.context['request'].user

        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu cũ không đúng")

        return value
        
    def validate_new_password(self, value):
        if not re.match(r'^(?=.*[A-Za-z])(?=.*\d).{8,24}$', value):
            raise serializers.ValidationError(
                "Password phải >=8 ký tự, gồm chữ và số"
            )
        return value
    
    def validate(self, data):
        if data['old_password'] == data['new_password']:
            raise serializers.ValidationError(
                "Mật khẩu mới không được trùng mật khẩu cũ"
            )
        return data
    
    def update(self, instance, validated_data):
        new_password = validated_data.get('new_password')
        instance.set_password(new_password)
        instance.save()
        return instance

        
        

