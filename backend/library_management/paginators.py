from rest_framework import pagination

class ItemPaginator(pagination.PageNumberPagination):
    page_size = 8
    
class UserPaginator(pagination.PageNumberPagination):
    page_size=5