from rest_framework import viewsets, mixins, parsers, status
from rest_framework.views import APIView, Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from library_management import paginators
from rest_framework.authtoken.models import Token
from library_management import perms
from django.db import transaction
from django.db.models import Count, Q
from library_management.services import reservation_services, searching_services, borrowing_services
from rest_framework.exceptions import ValidationError


class BaseViewSet(viewsets.GenericViewSet,
                    mixins.ListModelMixin, 
                    mixins.CreateModelMixin,
                    mixins.DestroyModelMixin,
                    mixins.RetrieveModelMixin,
                    mixins.UpdateModelMixin):
    authentication_classes = [TokenAuthentication]
    def get_queryset(self):
        query = super().get_queryset()
        if hasattr(query.model, 'active') or hasattr(query.model, 'is_active'):
            if not self.request.user.is_authenticated or not self.request.user.is_superuser:
                query = query.filter(active=True)
        if query.model == User:
            query = searching_services.sort_by_created_desc(query, field='last_login')
        elif hasattr(query.model, "created_at"):
            query = searching_services.sort_by_created_desc(query)
        return query
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response({
            "message": "Tạo mới thành công",
            "data": serializer.data
        },status=status.HTTP_201_CREATED)            
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        return Response({
            "message": "Cập nhật thành công"
        }, status=status.HTTP_200_OK)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)

        return Response(status=status.HTTP_204_NO_CONTENT)
        
    

class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [perms.SimplePermission]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        keyword = self.request.query_params.get("search")
        return searching_services.search_item_name(queryset, keyword)
    
    
class BookViewSet(BaseViewSet):
    queryset = Book.objects.all()    
    serializer_class = BookSerializer
    pagination_class = paginators.ItemPaginator
    permission_classes = [perms.SimplePermission]
    
    def get_queryset(self):
        query = super().get_queryset()
        query = query.select_related('author', 'publisher', 'category')
        q = self.request.query_params.get('q')
        if q:
            query = query.filter(name__icontains=q)
            
        cate_id = self.request.query_params.get('category_id')
        if cate_id:
            query = query.filter(category_id=cate_id)
        
        author_id = self.request.query_params.get('author_id')
        if author_id:
            query = query.filter(author_id = author_id)

        return query
    
    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        books = (
            self.get_queryset()
            .annotate(
                borrow_count=Count(
                    'user_book',
                    filter=Q(user_book__status__in=['BORROWING', 'RETURNED']),
                    distinct=True
                )
            )
            .order_by('-borrow_count')[:10]   
        )

        serializer = SimpleBookSerializer(books, many=True)
        return Response(serializer.data)

class UserViewSet(BaseViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser, parsers.FormParser]
    pagination_class = paginators.UserPaginator
    
    def get_permissions(self):
        if self.action in ['current_user', 'borrowing_list', 'orders_list']:
            return [IsAuthenticated()]
        return [perms.AdminPermission()]        
    
    def get_queryset(self):
        queryset =  super().get_queryset()
        keyword = self.request.query_params.get("search")
        return searching_services.search_user_name(queryset, keyword)

        
    @action(methods=['PATCH'], url_path='current_user', detail=False)
    def current_user(self, request):
        u = request.user
        if request.method.__eq__('PATCH'):
            serializer = SimpleUserSerializer(u, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            u = serializer.save()

        return Response(SimpleUserSerializer(u).data, status=status.HTTP_200_OK)
    
    @action(methods=['GET'], url_path='current_user/borrowing_list', detail=False,)
    def borrowing_list(self, request):
        user = request.user
        borrowing = user.user_book_set.select_related('user').all()
        borrowing = searching_services.sort_by_created_desc(borrowing)            
        status_param = request.query_params.get("status")
        if status_param:
            borrowing = searching_services.search_item_by_status(borrowing, status_param, User_Book.BorrowStatus)
            
        p = paginators.ItemPaginator()
        page = p.paginate_queryset(borrowing, request)
        if page is not None:
            serializer = BorrowSerializer(page, many=True)
            return p.get_paginated_response(serializer.data)

        return Response(BorrowSerializer(borrowing, many=True).data, status=status.HTTP_200_OK)
    
    @action(methods=["GET"], url_path='current_user/orders', detail=False)
    def orders_list(self, request):
        user = request.user
        orders = user.reservation_set.select_related('user').all()
        orders = searching_services.sort_by_created_desc(orders)            
        p = paginators.ItemPaginator()
        page = p.paginate_queryset(orders, request)
        if page is not None:
            serializer = BorrowSerializer(page, many=True)
            return p.get_paginated_response(serializer.data)
        return Response(ReservationSerializer(orders, many=True).data, status=status.HTTP_200_OK)

class AuthViewSet(viewsets.ViewSet):
    @action(methods=['POST'], detail=False, url_path='login')
    def login(self, request):
        data = request.data
        
        if not data:
            return Response({
                "message": "Yêu cầu là bắt buộc"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            serializer = LoginSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']    
            token, _ = Token.objects.get_or_create(user=user)

            return Response({
                'status': True,
                'token': token.key,
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'image': user.image.url if user.image else None,
                    'phone_number': user.phone_number,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_superuser': user.is_superuser,
                    'is_staff': user.is_staff,
                    'gender': user.gender,
                    'dob': user.dob,
                    'is_active': user.is_active
                }
            }, status=status.HTTP_200_OK)
        except (AuthenticationFailed) as e:
            return Response({
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['POST'], detail=False, url_path='register')
    def register(self, request):
        data = request.data

        if not data:
            return Response({
                "message": "Yêu cầu là bắt buộc"
            }, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            serializer = RegisterSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            return Response({
                'success': True,
                'message': 'Đăng ký thành công',                
            }, status=status.HTTP_201_CREATED)
        except (AuthenticationFailed) as e:
            return Response({
                'success': False,
                'message': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)
        
    @action(methods=['post'], detail=False, url_path='logout', permission_classes=[IsAuthenticated()])
    def logout(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Logout thành công!'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BorrowViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    serializer_class = BorrowSerializer
    pagination_class = paginators.ItemPaginator
    def get_permissions(self):
        if self.action == 'borrow_books':
            return [IsAuthenticated()]
        return [perms.StaffPermission()]
    
    def get_queryset(self):
        queryset = User_Book.objects.all()
        queryset = searching_services.sort_by_created_desc(queryset)            
        user = self.request.query_params.get("user")
        book = self.request.query_params.get("book")
        status = self.request.query_params.get("status")
        if user:
            queryset = searching_services.search_user_name(queryset, user)
        if book:
            queryset = searching_services.search_item_name(queryset, book, field="book__name")
        if status:
            queryset = searching_services.search_item_by_status(queryset, status, User_Book.BorrowStatus)
        return queryset
    
    # -----------------------Action POST Mượn sách từ giỏ hàng----------------------- #
    @action(methods=['POST'], detail=False, url_path='cart')
    def borrow_books(self, request):
        user = request.user
        cart = request.data.get("cart", [])

        try:
            borrowing_services.validate_cart(cart)
            borrowing_services.check_pending_request(user)
            borrowing_services.check_max_books(user, cart)

            with transaction.atomic():
                for item in cart:
                    borrowing_services.check_stock(item)

                    serializer = CartItemSerializer(
                        data=item,
                        context={'request': request}
                    )
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

            return Response({
                "success": True,
                "message": "Đặt sách thành công",
            }, status=status.HTTP_201_CREATED)

        except (ValueError, TypeError, ValidationError) as e:
            return Response({
                "success": False,
                "message": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
# -----------------------Action PATCH Mượn sách từ giỏ hàng----------------------- #
    @action(methods=['patch'], detail=True, url_path='update_status')
    def update_status(self, request, pk=None):
        borrow_obj = get_object_or_404(User_Book, pk=pk)
        new_status = request.data.get('status')
        try:
            borrow_obj = borrowing_services.update_borrow_status(borrow_obj, new_status)
        except ValueError as e:
            return Response({
                "message": str(e)
            },status=status.HTTP_400_BAD_REQUEST)
        
        borrow_obj.save()
        
        return Response({
            'message': 'Cập nhật trạng thái thành công'
        }, status=status.HTTP_202_ACCEPTED)
        
    # @action(methods=['patch'], detail=True, url_path='update_quantity')
    # def update_quantity(self, request, pk=None):
    #     borrow_obj = get_object_or_404(User_Book, pk=pk)
    #     new_quantity = request.data.get('borrowing_quantity')
    #     try:
    #         borrow_obj = borrowing_serivces.update_borrow_quantity(borrow_obj, new_quantity)
    #     except ValueError as e:
    #         return Response({
    #             "message": str(e)
    #         },status=status.HTTP_400_BAD_REQUEST)
        
    #     borrow_obj.save()
        
    #     return Response({
    #         'message': 'Cập nhật thành công'
    #     }, status=status.HTTP_202_ACCEPTED)
        
        
class ReservationViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin):
    serializer_class = ReservationSerializer
    pagination_class = paginators.ItemPaginator
    def get_permissions(self):
        if self.action == 'ordering_book':
            return [IsAuthenticated()]
        return [perms.StaffPermission()]
    
    def get_queryset(self):
        queryset = Reservation.objects.all()
        queryset = searching_services.sort_by_created_desc(queryset)            
        user = self.request.query_params.get("user")
        book = self.request.query_params.get("book")
        status = self.request.query_params.get("status")
        if user:
            queryset = searching_services.search_user_name(queryset, user)
        if book:
            queryset = searching_services.search_item_name(queryset, book, field="book__name")
        if status:
            queryset = searching_services.search_item_by_status(queryset, status, Reservation.ReservationStatus)
        return queryset
    
    @action(methods=['POST'], detail=False, url_path='order')
    def ordering_book(self, request):
        user = request.user
        try:
            reservation_services.check_pending_reservation(user)
        except ValueError as e:
            return Response({
                'message': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
        serializer = ReservationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=user)
        return Response({
            'message': "Đặt trước sách thành công",
        }, status=status.HTTP_201_CREATED)
        
    @action(methods=['PATCH'], detail=True, url_path='update_status')
    def update_status(self, request, pk=None):
        reservation_obj = get_object_or_404(Reservation, pk=pk)
        new_status = request.data.get('status')
        try:
            reservation_obj = reservation_services.update_reservation_status(reservation_obj, new_status)
        except ValueError as e:
            return Response({
                "message": str(e)
            },status=status.HTTP_400_BAD_REQUEST)
        
        reservation_obj.save()
        
        return Response({
            'message': 'Cập nhật trạng thái thành công'
        }, status=status.HTTP_202_ACCEPTED)
        
        
class AuthorViewSet(BaseViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [perms.SimplePermission]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        keyword = self.request.query_params.get("search")
        return searching_services.search_item_name(queryset, keyword)

class PublisherViewSet(BaseViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer  
    permission_classes = [perms.SimplePermission]
    def get_queryset(self):
        queryset = super().get_queryset()
        keyword = self.request.query_params.get("search")
        return searching_services.search_item_name(queryset, keyword)
    
class SettingViewSet(BaseViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [perms.SimplePermission]
    
    


    
