from rest_framework import viewsets, mixins, parsers, status
from rest_framework.views import APIView, Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from django.utils import timezone
from . models import *
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from library_management import paginators
from rest_framework.authtoken.models import Token
from library_management import perms
from django.db import transaction


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
        return query
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)

        return Response({
            "message": "Tạo thành công",
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

        return Response({
                "message": "Xóa thành công",
                "name": instance.name
        },status=status.HTTP_200_OK)
        
    

class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [perms.SimplePermission]
    
    
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
    

class UserViewSet(BaseViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser, parsers.FormParser]
    pagination_class = paginators.UserPaginator
    
    def get_permissions(self):
        if self.action in ['current_user', 'borrowing_list', 'orders_list']:
            return [IsAuthenticated()]
        return [perms.AdminPermission()]        
        
    @action(methods=['GET', 'PATCH'], url_path='current_user', detail=False,
        authentication_classes=[TokenAuthentication])
    def current_user(self, request):
        u = request.user
        if request.method.__eq__('PATCH'):
            serializer = SimpleUserSerializer(u, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            u = serializer.save()

        return Response(SimpleUserSerializer(u).data, status=status.HTTP_200_OK)
    
    @action(methods=['GET'], url_path='current_user/borrowing_list', detail=False,
            authentication_classes=[TokenAuthentication])
    def borrowing_list(self, request):
        user = request.user
        borrowing = user.user_book_set.select_related('user').all()
        return Response(BorrowSerializer(borrowing, many=True).data, status=status.HTTP_200_OK)
    
    @action(methods=["GET"], url_path='current_user/orders', detail=False,
            authentication_classes=[TokenAuthentication])
    def orders_list(self, request):
        user = request.user
        orders = user.reservation_set.select_related('user').all()
        return Response(ReservationSerializer(orders, many=True).data, status=status.HTTP_200_OK)

    
        

class LoginAPIView(APIView):
    def post(self, request):
        data = request.data
        serializer = LoginSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']            
        
        
        if user:
            token, is_create = Token.objects.get_or_create(user=user)
            
            return Response({
            'status': True,
            'token': token.key,
            'user': {
                'username': user.username,
                'email': user.email,
                'image': user.image.url,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff
            }}, status=status.HTTP_200_OK)
            
        return Response({
            'status': False,
            'data': {},
            'message': 'Invalid credentials'
        }, status=status.HTTP_400_BAD_REQUEST)
        
class RegisterViewSet(APIView):
    def post(self, request):
        data = request.data
        serializer = RegisterSerializer(data=data)
        
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "status": True,
            "message": "Created succeed",
            "data": user.username
        }, status=status.HTTP_201_CREATED)
        
        

class LogoutAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    


class UpdateBorrowStatusAPIView(APIView):
    permission_classes = [perms.StaffPermission]
    authentication_classes = [TokenAuthentication]
    
    def patch(self, request, pk):
        borrow_obj = get_object_or_404(User_Book, pk=pk)
        new_status = request.data.get('status')
        
        
        if new_status not in User_Book.BorrowStatus.values:
            return Response({
                'message': 'Invalid Status'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if borrow_obj.status == User_Book.BorrowStatus.RETURNED:
            return Response({
                {'message': 'Cannot update returned book'}
            },status=status.HTTP_400_BAD_REQUEST)
         
        
        if new_status == User_Book.BorrowStatus.BORROWING:
            borrow_obj.borrowing_book_date = timezone.now()
        elif new_status == User_Book.BorrowStatus.RETURNED:
            borrow_obj.returning_book_date = timezone.now()
        
        borrow_obj.status = new_status
        borrow_obj.save()
        
        return Response({
            'message': 'Status update successful'
        }, status=status.HTTP_200_OK)

class BorrowViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    serializer_class = BorrowSerializer
    pagination_class = paginators.ItemPaginator
    def get_permissions(self):
        if self.action == 'borrow_books':
            return [IsAuthenticated()]
        return [perms.StaffPermission()]
    
    def get_queryset(self):
        queryset = User_Book.objects.all()
        
        user_id = self.kwargs.get("user_id")
        book_id = self.kwargs.get("book_id")
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        return queryset
    
    # -----------------------Action POST Mượn sách từ giỏ hàng----------------------- #
    @action(methods=['POST'], detail=False, url_path='cart')
    @authentication_classes([TokenAuthentication])
    def borrow_books(self, request):
        # Lấy dữ liệu request lên trả về dưới dạng dict
        user = request.user
        cart = request.data.get("cart", []) 
        if not cart:
            return Response({
                    "success": False,
                    "error": "Không có sách trong giỏ hàng"
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if User_Book.objects.filter(user=user, status=User_Book.BorrowStatus.PENDING).exists():
            return Response({
                    'success': False,
                    'error': 'Yêu cầu của bạn đang được xử lý. Không thể gửi thêm yêu cầu!'
                },status=status.HTTP_400_BAD_REQUEST)
        
        max_borrowing_books = 5
        total_books_in_cart = sum(item['borrowing_quantity'] for item in cart)
        
        current_borrowing_book = User_Book.objects.filter(
            user=user, 
            returning_book_date__isnull=True, 
            status__in=[User_Book.BorrowStatus.BORROWING, User_Book.BorrowStatus.OVERDUE]
        ).aggregate(total=Sum('borrowing_quantity'))['total'] or 0
        
        if current_borrowing_book + total_books_in_cart > max_borrowing_books:
            return Response({
                    'success': False,
                    'error': f'Bạn không thể mượn quá {max_borrowing_books} 5 sách từ thư viện'
                },status=status.HTTP_400_BAD_REQUEST)
        
        borrowing_books = []
        with transaction.atomic():
            for item in cart:
                book_obj = Book.objects.get(id=item['book_id'])
                
                if book_obj.available_quantity() < item['borrowing_quantity']:
                    return Response({
                        'success': False,
                        'error': 'Số lượng sách không còn đủ'
                    }, status=status.HTTP_400_BAD_REQUEST)
                serializer = CartItemSerializer(data=item, context={'request': request})
                serializer.is_valid(raise_exception=True)
                borrowing_book = serializer.save()
                borrowing_books.append(borrowing_book)
        
        return Response({
            'success': True,
            'message': "Đặt sách thành công",
        }, status=status.HTTP_201_CREATED)
    
# -----------------------Action PATCH Mượn sách từ giỏ hàng----------------------- #
    @authentication_classes([TokenAuthentication])
    @permission_classes([perms.StaffPermission])
    def partial_update(self, request, pk=None):
        borrow_obj = get_object_or_404(User_Book, pk=pk)
        new_status = request.data.get('status')
        
        
        if not new_status or new_status not in User_Book.BorrowStatus.values:            
            return Response({
                'message': 'Trạng thái không hợp lệ!'
            }, status=status.HTTP_400_BAD_REQUEST)
            
        if borrow_obj.status == User_Book.BorrowStatus.RETURNED:
            return Response({
                'message': 'Không thể update sách đã được trả'
            },status=status.HTTP_400_BAD_REQUEST)
        
        if new_status == borrow_obj.status:
            return Response({
                'message': f'Trạng thái hiện tại đã là {new_status}'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if new_status == User_Book.BorrowStatus.BORROWING:
            borrow_obj.borrowing_book_date = timezone.now()
        elif new_status == User_Book.BorrowStatus.RETURNED:
            borrow_obj.returning_book_date = timezone.now()
        
        borrow_obj.status = new_status
        borrow_obj.save()
        
        return Response({
            'message': 'Cập nhật trạng thái thành công'
        }, status=status.HTTP_202_ACCEPTED)

class ReservationViewSet(BaseViewSet):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()
    def get_queryset(self):
        queryset = Reservation.objects.all()
        
        user_id = self.kwargs.get("user_id")
        book_id = self.kwargs.get("book_id")
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        return queryset

    @action(methods=['POST'], detail=False, url_path='order',
            permission_classes=[IsAuthenticated], 
            authentication_classes=[TokenAuthentication])
    def ordering_book(self, request):
        user = request.user
        if Reservation.objects.filter(user=user, status=Reservation.ReservationStatus.WAITING).exists():
            return Response({
                'message': 'Không thể gửi thêm yêu cầu đơn đặt trước của bạn đang được xử lý.'
            }, status=status.HTTP_400_BAD_REQUEST)
        serializer = OrderItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reservation = serializer.save(user=user)
        
        return Response({
            'message': "Đặt trước sách thành công",
            'data': OrderItemSerializer(reservation).data
        }, status=status.HTTP_201_CREATED)
    
class AuthorViewSet(BaseViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [perms.SimplePermission]

class PublisherViewSet(BaseViewSet):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer  
    permission_classes = [perms.SimplePermission]
    
class SettingViewSet(BaseViewSet):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [perms.SimplePermission]
    
    


    
