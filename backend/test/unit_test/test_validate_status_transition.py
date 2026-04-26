import pytest
from backend.library_management.services import borrowing_services

# test valid    
VALID_CASES = [
    ("PENDING", "CONFIRMED"),
    ("PENDING", "CANCELLED"),

    ("CONFIRMED", "BORROWING"),
    ("CONFIRMED", "CANCELLED"),

    ("BORROWING", "RETURNED"),
    ("BORROWING", "OVERDUE"),

    ("OVERDUE", "RETURNED"),
]

# test invalid đại diện
INVALID_CASES = [
    ("PENDING", "BORROWING"),
    ("PENDING", "RETURNED"),
    ("CONFIRMED", "RETURNED"),
    ("RETURNED", "BORROWING"),
    ("CANCELLED", "PENDING"),
    ("CONFIRMED", "CONFIRMED")
]


@pytest.mark.parametrize("current,new", VALID_CASES)
def test_valid_transitions(current, new):
    borrowing_services.validate_status_transition(current, new)


@pytest.mark.parametrize("current,new", INVALID_CASES)
def test_invalid_transitions(current, new):
    with pytest.raises(ValueError):
        borrowing_services.validate_status_transition(current, new)