from django.db import transaction
from django.db.models import Sum
from library_management.models import Book, User_Book
from library_management.serializers import CartItemSerializer


def check_stock(item):
    try:
        book = Book.objects.get(id=item["book_id"])
    except Book.DoesNotExist:
        raise ValueError("Sách không tồn tại!")

    if book.available_quantity() <= 0:
        raise ValueError(f"Sách {book.name} hiện không còn!")

    if item['borrowing_quantity'] <= 0:
        raise ValueError("Số lượng mượn phải lớn hơn 0")

    if item['borrowing_quantity'] > book.available_quantity():
        raise ValueError(
            f"Sách {book.name} chỉ còn {book.available_quantity()} bản!"
        )
    return True


def validate_cart(cart):
    if not isinstance(cart, list):
        raise TypeError("Cart phải là list")
    if not cart:
        raise ValueError("Không có sách trong giỏ hàng")
    
def check_pending_request(user):
    if User_Book.objects.filter(
        user=user,
        status=User_Book.BorrowStatus.PENDING
    ).exists():
        raise ValueError("Không thể gửi thêm! Yêu cầu đang được xử lý.")
    
def check_max_books(user, cart, max_books=5):
    total_books = sum(item['borrowing_quantity'] for item in cart)

    current = User_Book.objects.filter(
        user=user,
        returning_book_date__isnull=True,
        status__in=[
            User_Book.BorrowStatus.BORROWING,
            User_Book.BorrowStatus.OVERDUE,
            User_Book.BorrowStatus.PENDING
        ]
    ).aggregate(total=Sum('borrowing_quantity'))['total'] or 0

    if current + total_books > max_books:
        raise ValueError(f"Không thể mượn quá {max_books} sách")
    
def process_borrow(user, cart, request):
    with transaction.atomic():
        for item in cart:

            check_stock(item)  

            serializer = CartItemSerializer(
                data=item,
                context={'request': request}
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()