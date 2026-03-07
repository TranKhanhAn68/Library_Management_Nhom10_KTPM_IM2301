from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from . models import *
from django.contrib.auth import authenticate
from .models import *
from .serializer import *
from rest_framework.response import Response

class CategoryView(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    
class LoginView(APIView):
    def post(self, request):
        username = request.data.get()