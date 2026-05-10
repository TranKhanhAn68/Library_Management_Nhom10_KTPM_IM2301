from django.db.models import Value, Q
from django.db.models.functions import Concat

def search_user_name(queryset, keyword, prefix=''):
    if not keyword:
        return queryset

    first_name = f'{prefix}first_name'
    last_name = f'{prefix}last_name'
    username = f'{prefix}username'

    queryset = queryset.annotate(
        full_name=Concat(
            first_name,
            Value(' '),
            last_name
        )
    )

    return queryset.filter(
        Q(full_name__icontains=keyword) |
        Q(**{f'{last_name}__icontains': keyword}) |
        Q(**{f'{username}__icontains': keyword}) |
        Q(**{f'{first_name}__icontains': keyword})
    )
    
def search_item_name(queryset, keyword, field="name"):
    if not keyword:
        return queryset
    
    return queryset.filter(
        Q(**{f"{field}__icontains": keyword})
    )
    
    
def search_item_by_status(queryset, option, status_list, field="status"):
    if not option:
        return queryset
    if option not in status_list:
        raise ValueError("Sự lựa chọn không hợp lệ")
    return queryset.filter(**{f"{field}__icontains": option})    
    
def sort_by_created_desc(queryset, field="created_at"):
    return queryset.order_by(f"-{field}")