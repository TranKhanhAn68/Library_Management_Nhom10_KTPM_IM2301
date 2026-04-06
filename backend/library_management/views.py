from rest_framework import viewsets, mixins, parsers, status
from rest_framework.views import APIView, Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import action, authentication_classes, permission_classes
from django.utils import timezone
from . models import *
from .models import *
from .serializers import *
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from library_management import paginators
from rest_framework.permissions import AllowAny, BasePermission, IsAuthenticated
from rest_framework.authtoken.models import Token

class IsAdminPermission(BasePermission):
    def has_permission(self, request, view):
        if request.method == 'GET':
            return True
        return request.user.is_superuser

    def has_object_permission(self, request, view, obj):
        if request.method == 'GET':
            return True
        return request.user.is_superuser

class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user == obj.user or request.user.is_superuser

class IsStaffPermission(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        if request.user.is_staff:
            return True
        return False
            

class CategoryViewSet(viewsets.GenericViewSet, 
                      mixins.ListModelMixin, 
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminPermission]
    
    
class BookViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Book.objects.filter(active=True)    
    serializer_class = BookSerializer
    pagination_class = paginators.ItemPaginator
    permission_classes = [IsAdminPermission]
    
    
    def get_queryset(self):
        query = self.queryset
        
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
    

class UserViewSet(viewsets.GenericViewSet, 
                  mixins.CreateModelMixin, 
                  mixins.RetrieveModelMixin, 
                  mixins.ListModelMixin, 
                  mixins.UpdateModelMixin):
    serializer_class = UserSerializer
    authentication_classes = [TokenAuthentication]
    parser_classes = [parsers.MultiPartParser, parsers.JSONParser]
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        elif self.action == 'update':
            return [IsOwner()]
        elif self.action == 'list':
            return [IsAdminPermission()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        queryset = User.objects.filter(is_active=True)
        return queryset
        
    def get_object(self):
        queryset = self.get_queryset()
        pk = self.kwargs.get('pk')
        if not self.request.user.is_superuser:
            pk = self.request.user.pk
        obj = get_object_or_404(queryset, pk=pk)
        self.check_object_permissions(self.request, obj)
        return obj
    
    print()
        

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
                'is_superuser': user.is_superuser
            }})
            
        return Response({
            'status': False,
            'data': {},
            'message': 'Invalid credentials'
        })
        
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
    
def check_stock_and_create(user, book):
    book_obj = get_object_or_404(Book, pk=book["id"])
    if book['borrowing_quantity'] > book_obj.available_quantity:
        raise ValueError(f"Book {book_obj.name} only has {book_obj.available_quantity} copies left")
    User_Book.objects.create(user=user, book=book_obj, status=User_Book.BorrowStatus.PENDING)
    return book_obj.name

class UpdateBorrowStatusAPIView(APIView):
    permission_classes = [IsStaffPermission]
    authentication_classes = [TokenAuthentication]
    
    def put(self, request, pk):
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
        user = request.user
        books = request.data.get("books", []) 
        
        if not books:
            return Response({
                "error": "No books in your cart",
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User_Book.objects.filter(user=user, status=User_Book.BorrowStatus.PENDING).count() > 0:
            return Response({
                'Message': 'Your request is currently processed. Please do not send anything!'
            }, status=status.HTTP_400_BAD_REQUEST)
            
            
        max_borrowing_books = 5
        total_books_in_cart = sum(book['borrowing_quantity'] for book in books)
            
        current_borrowing_book = User_Book.objects.filter(
            user=user, 
            returning_book_date__isnull=True, 
            status__in=[User_Book.BorrowStatus.BORROWING, User_Book.BorrowStatus.OVERDUE]
        ).aggregate(total=Sum('borrowing_quantity'))['total'] or 0
        
        check_amount_book = (current_borrowing_book + total_books_in_cart) <= 5
        
        if not check_amount_book:
            return Response({
                'error': f'You cannot borrow up to {max_borrowing_books} books at the same time'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        borrowing_books = []
        for book in books:
            try:
                book_obj = check_stock_and_create(user,book)
                borrowing_books.append(book_obj)
            except ValueError as e:
                return Response({
                    'message': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        return Response({
            'message': "Successful borrowing"
        }, status=status.HTTP_200_OK)


class ReservationViewSet(viewsets.GenericViewSet, 
                      mixins.ListModelMixin, 
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin):
    serializer_class = ReservationSerializer
    queryset = Reservation.objects.all()
    authentication_classes = [TokenAuthentication]
    def get_queryset(self):
        queryset = Reservation.objects.all()
        
        user_id = self.kwargs.get("user_id")
        book_id = self.kwargs.get("book_id")
        
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        if book_id:
            queryset = queryset.filter(book_id=book_id)
        return queryset


class AuthorViewSet(viewsets.GenericViewSet, 
                      mixins.ListModelMixin, 
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [IsAdminPermission]

class PublisherViewSet(viewsets.GenericViewSet, 
                      mixins.ListModelMixin, 
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin
                      ):
    queryset = Publisher.objects.all()
    serializer_class = PublisherSerializer
    permission_classes = [IsAdminPermission]
    authentication_classes = [TokenAuthentication]
    
class SettingViewSet(viewsets.GenericViewSet, 
                      mixins.ListModelMixin, 
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      mixins.RetrieveModelMixin,
                      mixins.UpdateModelMixin
                      ):
    queryset = Setting.objects.all()
    serializer_class = SettingSerializer
    permission_classes = [IsAdminPermission]
    authentication_classes = [TokenAuthentication]


    
