from library_management.models import User_Book, Reservation
MAX_BORROW_BOOKS = 5


ALLOWED_TRANSITIONS = {
    User_Book.BorrowStatus.PENDING: [
        User_Book.BorrowStatus.CONFIRMED,
        User_Book.BorrowStatus.CANCELLED,
    ],

    User_Book.BorrowStatus.CONFIRMED: [
        User_Book.BorrowStatus.BORROWING,
        User_Book.BorrowStatus.CANCELLED,
    ],

    User_Book.BorrowStatus.BORROWING: [
        User_Book.BorrowStatus.RETURNED,
        User_Book.BorrowStatus.OVERDUE,
    ],

    User_Book.BorrowStatus.OVERDUE: [
        User_Book.BorrowStatus.RETURNED,
    ],

    User_Book.BorrowStatus.RETURNED: [],
    User_Book.BorrowStatus.CANCELLED: [],
}


ALLOWED_TRANSITIONS_ORDERING = {
    Reservation.ReservationStatus.WAITING: [
        Reservation.ReservationStatus.CONFIRMED,
        Reservation.ReservationStatus.ALREADY,
        Reservation.ReservationStatus.CANCELLED
    ],

    Reservation.ReservationStatus.CONFIRMED: [
        Reservation.ReservationStatus.ALREADY,
        Reservation.ReservationStatus.EXPIRED
        
    ],

    Reservation.ReservationStatus.ALREADY: [],

    Reservation.ReservationStatus.CANCELLED: [],

    Reservation.ReservationStatus.EXPIRED: [],
}