from rest_framework import serializers

def validate_unique_name(model, name, error_message=None):
    if model.objects.filter(name=name).exists():
        raise serializers.ValidationError(
            error_message or "Tên đã tồn tại!"
        )
        
        

def validate_unique_book_id(model, id, error_message=None):
    if model.objects.filter(book_id=id).exists():
        raise serializers.ValidationError(
            error_message or "Book Code đã được định danh!"
        )
        