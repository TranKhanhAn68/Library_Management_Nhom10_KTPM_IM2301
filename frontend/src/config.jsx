export const ROLES = {
    ADMIN: 'is_superuser',
    STAFF: 'is_staff',
};

export const PERMISSIONS = {
    CAN_MANAGE_ALL: [ROLES.ADMIN],
    CAN_VIEW_DASHBOARD: [ROLES.ADMIN, ROLES.STAFF],
    CAN_HANDLE_ORDERS: [ROLES.STAFF]
};