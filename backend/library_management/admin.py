from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.db.models import Count
from django.template.response import TemplateResponse
from django.utils.safestring import mark_safe
from django import forms
from .models import Category, Book, User
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from django.urls import path

class BookForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['description'].required = False

class BookAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name']
    search_fields = ['name']
    list_filter = ['id', 'name']
    readonly_fields = ['avatar']
    form = BookForm

    def avatar(self, course):
        return mark_safe(f'<img src="{course.image.url}" width="150" />')

class MyAdminSite(admin.AdminSite):
    site_header = 'eCourse App'

    def get_urls(self):
        return [path('stats-view/', self.stat_view)] + super().get_urls()

    def stat_view(self, request):
        stats = Category.objects.annotate(count=Count('course')).values('id', 'name', 'count')
        return TemplateResponse(request, 'admin/stats.html', {'stats': stats})

admin_site = MyAdminSite()

# Register your models here.
admin_site.register(Category)
admin_site.register(Book, BookAdmin)
admin_site.register(User)