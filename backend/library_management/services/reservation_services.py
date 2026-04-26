from library_management.models import Reservation
from library_management.services import constraint

def check_pending_reservation(user):
    if Reservation.objects.filter(
        user=user,
        status=Reservation.ReservationStatus.WAITING
    ).exists():
        raise ValueError(
            "Không thể gửi thêm yêu cầu đơn đặt trước của bạn đang được xử lý."
        )
        
def validate_status_transitio_ordering(current_status, new_status):
    allowed = constraint.ALLOWED_TRANSITIONS_ORDERING.get(current_status, [])

    if new_status not in allowed:
        raise ValueError(
            f"Không thể chuyển từ {current_status} sang {new_status}"
        )
        
def update_reservation_status(borrow_obj, new_status):
    try:
        new_status = Reservation.ReservationStatus(new_status)
    except ValueError:
        raise ValueError("Trạng thái không hợp lệ!")
    
    validate_status_transitio_ordering(borrow_obj.status, new_status)   
    borrow_obj.status = new_status
    return borrow_obj