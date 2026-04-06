"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from library_management.admin import admin_site
from library_management import views
from rest_framework import routers
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter()
router.register('categories', views.CategoryViewSet, basename='categories')
router.register('books', views.BookViewSet)
router.register('users', views.UserViewSet, basename='users')
router.register('authors', views.AuthorViewSet)
router.register('publishers', views.PublisherViewSet)
router.register('borrowing-books',views.BorrowViewSet, basename='borrowing-books')
router.register('reservations', views.ReservationViewSet, basename='reservations')
router.register('settings', views.SettingViewSet, basename='settings')
schema_view = get_schema_view(
    openapi.Info(
        title="Course API",
        default_version='v1',
        description="APIs for CourseApp",
        contact=openapi.Contact(email="2351050004an@ou.edu.vn"),
        license=openapi.License(name="Trần Khánh An"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[],  # DRF auth ở view
)

# Thêm security scheme cho token
SWAGGER_SETTINGS = {
    'SECURITY_DEFINITIONS': {
        'Token': {
            'type': 'apiKey',
            'name': 'Authorization',
            'in': 'header'
        }
    }
}

urlpatterns = [
    path('admin/', admin_site.urls),
    path('', include(router.urls)),
    path('borrowing-books/<int:pk>/edit-status/', views.UpdateBorrowStatusAPIView.as_view()),
    path('account/register/', views.RegisterViewSet.as_view(), name='register_user'),
    path('account/login/', views.LoginAPIView.as_view(), name='login_user'),
    path('account/logout/', views.LogoutAPIView.as_view(), name='logout_user'),
    path('api/token/', obtain_auth_token),
    re_path(r'^swagger(?P<format>\.json|\.yaml)$',
            schema_view.without_ui(cache_timeout=0),
            name='schema-json'),
    re_path(r'^swagger/$',
            schema_view.with_ui('swagger', cache_timeout=0),
            name='schema-swagger-ui'),
]
