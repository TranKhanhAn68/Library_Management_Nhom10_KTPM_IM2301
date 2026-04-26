export const ROLES = {
    ADMIN: 'is_superuser',
    STAFF: 'is_staff',
};

export const PERMISSIONS = {
    CAN_MANAGE_ALL: [ROLES.ADMIN],
    CAN_VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.STAFF],
    CAN_HANDLE_ORDERS: [ROLES.STAFF]
};


export const STATUS_CONFIG = {
    "PENDING": {
        label: "Chờ xử lý",
        value: "PENDING",
        className: "tw-bg-yellow-100 tw-text-yellow-600",
    },
    "CONFIRMED": {
        label: "Đã xác nhận",
        value: "CONFIRMED",
        className: "tw-bg-emerald-100 tw-text-emerald-700",
    },
    "BORROWING": {
        label: "Đang mượn",
        value: "BORROWING",
        className: "tw-bg-blue-100 tw-text-blue-600",
    },
    "RETURNED": {
        label: "Đã trả",
        value: "RETURNED",
        className: "tw-bg-green-100 tw-text-green-600",
    },
    "OVERDUE": {
        label: "Quá hạn",
        value: "OVERDUE",
        className: "tw-bg-red-100 tw-text-red-600",
    },
    "CANCELLED": {
        label: "Đã hủy",
        value: 'CANCELLED',
        className: "tw-bg-gray-200 tw-text-gray-600",
    },
};


export const RESERVATION_STATUS_CONFIG = {
    "WAITING": {
        label: "Chờ xác nhận",
        value: "WAITING",
        className: "tw-bg-yellow-100 tw-text-yellow-600",
    },
    "CONFIRMED": {
        label: "Đã xác nhận",
        value: "CONFIRMED",
        className: "tw-bg-emerald-100 tw-text-emerald-700",
    },
    "ALREADY": {
        label: "Đã lấy sách",
        value: "ALREADY",
        className: "tw-bg-blue-100 tw-text-blue-600",
    },
    "CANCELLED": {
        label: "Đã hủy",
        value: "CANCELLED",
        className: "tw-bg-gray-200 tw-text-gray-600",
    },
    "EXPIRED": {
        label: "Hết hạn",
        value: "EXPIRED",
        className: "tw-bg-red-100 tw-text-red-600",
    },
};