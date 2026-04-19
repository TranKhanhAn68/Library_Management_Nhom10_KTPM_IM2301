import pytest

from library_management.models import *
from library_management.services import borrowing_serivces
@pytest.mark.django_db
def test_check_stock_return_true():
    category = Category.objects.create(name="IT")

    book = Book.objects.create(
        id=5,
        book_id="B006",
        name="Python",
        total_quantity=10,
        category=category,
    )

    result = borrowing_serivces.check_stock({
        "book_id": book.id,
        "name": book.name,
        "date": "2026-01-01",
        "borrowing_quantity": 5,
    })
    assert result is True
    

@pytest.mark.django_db
def test_check_stock_exact_quantity():

    category = Category.objects.create(name="IT")

    book = Book.objects.create(
        id=5,
        book_id="B009",
        name="Python",
        total_quantity=3,
        category=category,
    )

    result = borrowing_serivces.check_stock({
        "book_id": book.id,
        "name": book.name,
        "date": "2026-01-01",
        "borrowing_quantity": 3,
    })
    assert result is True


    
@pytest.mark.django_db
def test_check_stock_failed():
    category = Category.objects.create(name="IT")
    book = Book.objects.create(
        id=5,
        book_id="B007",
        name="Python",
        total_quantity=1,
        category=category,
    )
    with pytest.raises(ValueError) as info:
        borrowing_serivces.check_stock({
            "book_id": book.id,
            "name": book.name,
            "date": "2026-01-01",
            "borrowing_quantity": 5,
        })
        
    assert str(info.value) == f"Sách {book.name} chỉ còn {book.available_quantity()} bản!"
    
@pytest.mark.django_db
def test_check_stock_zero_quantity():
    category = Category.objects.create(name="IT")
    book = Book.objects.create(
        id=5,
        book_id="B007",
        name="Python",
        total_quantity=1,
        category=category,
    )
    with pytest.raises(ValueError) as info:
        borrowing_serivces.check_stock({
            "book_id": book.id,
            "name": book.name,
            "date": "2026-01-01",
            "borrowing_quantity": 0,
        })
        
    assert str(info.value) == "Số lượng mượn phải lớn hơn 0"
    
@pytest.mark.django_db
def test_book_not_found():
    category = Category.objects.create(name="IT")
    book = Book.objects.create(
        id=5,
        book_id="B007",
        name="Python",
        total_quantity=1,
        category=category,
    )
    with pytest.raises(ValueError) as info:
        borrowing_serivces.check_stock({
            "book_id": 9999,
            "borrowing_quantity": 1
        })
    assert str(info.value) == "Sách không tồn tại!"

@pytest.mark.django_db
def test_check_stock_when_no_enough_stock():
    user = User.objects.create_user(username='test')
    category = Category.objects.create(name="IT")
   

    book = Book.objects.create(
        id=5,
        book_id="B011",
        name="Python",
        total_quantity=2,
        category=category,
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=2,
        status="BORROWING"
    )

    with pytest.raises(ValueError) as info:
        borrowing_serivces.check_stock({
            "book_id": book.id,
            "borrowing_quantity": 1
        })
        
    assert str(info.value) == f"Sách {book.name} hiện không còn!"
    
    
# test Validate Cart
@pytest.mark.django_db
def test_validate_cart_empty():
    with pytest.raises(ValueError) as info:
        borrowing_serivces.validate_cart([])
    assert str(info.value) == "Không có sách trong giỏ hàng"

@pytest.mark.django_db
def test_validate_cart_is_null():
    
    with pytest.raises(TypeError) as info:
        borrowing_serivces.validate_cart(None)
    assert str(info.value) == "Cart phải là list"

@pytest.mark.django_db
def test_validate_cart_invalid_type():
    with pytest.raises(TypeError) as info:
        borrowing_serivces.validate_cart("[]")
    assert str(info.value) == "Cart phải là list"

@pytest.mark.django_db
def test_validate_cart_valid():
    borrowing_serivces.validate_cart(["book1"])

@pytest.mark.django_db
def test_pending_request():
    user = User.objects.create_user(username='test')
    book = Book.objects.create(
        book_id="B003",
        name="Python",
        total_quantity=10,
    )
    
    book_2nd = Book.objects.create(
        book_id="B004",
        name="Java",
        total_quantity=10,
    )

    User_Book.objects.create(
        user=user,
        book=book,
        borrowing_quantity=3,
    )
    
    User_Book.objects.create(
        user=user,
        book=book_2nd,
        borrowing_quantity=2
    )
    with pytest.raises(ValueError) as info:
        borrowing_serivces.check_pending_request(user)
    assert str(info.value) == "Không thể gửi thêm! Yêu cầu đang được xử lý."