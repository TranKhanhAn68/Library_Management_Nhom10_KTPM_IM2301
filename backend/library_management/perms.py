from rest_framework import permissions

class SimplePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        return request.user.is_superuser    

# class IsOwner(BasePermission):
#     def has_object_permission(self, request, view, obj):
#         if not request.user.is_authenticated:
#             return False
#         if request.user.is_superuser:
#             return True
#         return request.user == obj.user

class StaffPermission(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return False
    
class AdminPermission(permissions.IsAuthenticated):
    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        return False