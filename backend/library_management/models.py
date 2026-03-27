from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


# Create your models here.
class User(AbstractUser):
    phone_number = models.CharField(max_length=15, null=True)
    image = CloudinaryField(
        'image',
        folder='users',
        null=True,
        blank=True, 
    )
    
    
class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    employee_id = models.CharField(max_length=20, null=False)
    shift = models.CharField(max_length=100)
    identity_card = models.CharField(max_length=50)

class BaseView(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)
    
    class Meta:
        abstract = True
        
class Author(models.Model):
    name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    date_of_death = models.DateField(null=True, blank=True)
    biography = RichTextField()
    image = CloudinaryField(
        'image',
        folder='authors',
        null=True,
        blank=True, 
    )
    description = RichTextField(null=True)
    
    def __str__(self):
        return self.name
    
class Publisher(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name
        
class Category(BaseView):
    name = models.CharField(max_length=50, null=False)

    def __str__(self):
        return self.name
    
class Book(BaseView):
    book_id = models.CharField(max_length=10, null=True, unique=True)
    name = models.CharField(max_length=255, null=False)
    total_quantity = models.IntegerField(default=1)
    available_quantity = models.IntegerField(default=1)
    image = CloudinaryField(
        'image',
        folder='books',
        null=True,
        blank=True, 
    )
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE)
    description = RichTextField(null=True)
    
class User_Book(models.Model):
    class BorrowStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"        
        CONFIRMED = "CONFIRMED", "Confirmed"           
        BORROWING = "BORROWING", "Borrowing"    
        RETURNED = "RETURNED", "Returned"             
        OVERDUE = "OVERDUE", "Overdue"   
        CANCELLED = "CANCELLED", "Cancelled"
        EXPIRED = "EXPIRED", "Expired"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.PROTECT)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    borrowing_book_date = models.DateField(auto_now_add=True)
    returning_book_date = models.DateField(null=True)
    due_date = models.DateField(null=True)
    borrowing_quantity = models.IntegerField(default=1)
    status = models.CharField(max_length=20, choices=BorrowStatus.choices, default=BorrowStatus.PENDING)
    note = models.CharField(max_length=255, null=True)
    
class User_Book_Detail_Fine(models.Model):
    user_book = models.OneToOneField(User_Book, on_delete=models.CASCADE, primary_key=True)
    late_dates = models.IntegerField()
    total_fine_overdue = models.DecimalField(max_digits=10, decimal_places=2)
    setting = models.ForeignKey("Setting", on_delete=models.PROTECT)
        
class Setting(models.Model):
    borrowing_days = models.IntegerField()
    borrowing_overdue_fine = models.DecimalField(max_digits=10, decimal_places=2)

class Reservation(models.Model):
    class ReservationStatus(models.TextChoices):
        WAITING = "WAITING", "Waiting"
        CONFIRMED = "CONFIRMED", "Confirmed"
        READY = "READY", "Ready"
        CANCELLED = "CANCELLED", "Cancelled"
        EXPIRED = "EXPIRED", "Expired"
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    reservation_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField( max_length=20,
        choices=ReservationStatus.choices,
        default=ReservationStatus.WAITING)
    
class Interaction(BaseView):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    class Meta:
        abstract = True


class Comment(Interaction):
    content = models.CharField(max_length=255)

class Like(Interaction):
    is_like = models.BooleanField(default=0)
    class Meta:
        unique_together = ('book', 'user')
        
class Activity_Log(models.Model):
    class TargetType(models.TextChoices):
        BOOK = "BOOK", "Book"
        RESERVATION = "RESERVATION", "Reservation"
        COMMENT = "COMMENT", "Comment" 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=20, choices=TargetType.choices)
    target_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

