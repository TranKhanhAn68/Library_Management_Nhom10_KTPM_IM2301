from django.db.models import Sum
from library_management.models import Book, User_Book
from library_management.services import constraint
from django.utils import timezone


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
    
def check_max_books(user, cart):
    total_books = sum(item['borrowing_quantity'] for item in cart)

    current_books = User_Book.objects.filter(
        user=user,
        returning_book_date__isnull=True,
        status__in=[
            User_Book.BorrowStatus.BORROWING,
            User_Book.BorrowStatus.OVERDUE,
            User_Book.BorrowStatus.PENDING
        ]
    ).aggregate(total=Sum('borrowing_quantity'))['total'] or 0

    if current_books + total_books > constraint.MAX_BORROW_BOOKS:
        raise ValueError(f"Không thể mượn quá {constraint.MAX_BORROW_BOOKS} sách")
    
    return True
    

def validate_status_transition(current_status, new_status):
    allowed = constraint.ALLOWED_TRANSITIONS.get(current_status, [])

    if new_status not in allowed:
        raise ValueError(
            f"Không thể chuyển từ {current_status} sang {new_status}"
        )
        
def update_borrow_status(borrow_obj, new_status):
    try:
        new_status = User_Book.BorrowStatus(new_status)
    except ValueError:
        raise ValueError("Trạng thái không hợp lệ!")
    
    validate_status_transition(borrow_obj.status, new_status)   
    borrow_obj.status = new_status

    if borrow_obj.status == User_Book.BorrowStatus.CONFIRMED:
        borrow_obj.borrowing_book_date = timezone.localtime(timezone.now())
        borrow_obj.set_due_date(borrow_obj.user_book_detail_fine.setting.borrowing_days)

    elif borrow_obj.status == User_Book.BorrowStatus.RETURNED:
        borrow_obj.returning_book_date = timezone.localtime(timezone.now())

    return borrow_obj 


