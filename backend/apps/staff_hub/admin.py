from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from apps.staff_hub.models.permission import Permission
from apps.staff_hub.models.organization import Organization
from apps.staff_hub.models.organization_member import OrganizationMember
User = get_user_model()


class UserAdminCustom(UserAdmin):
    # ユーザー詳細
    fieldsets = (
        (None, {
            'fields': (
                'name',
                'email',
                # 'image',
                'password',
                'is_active',
                'is_staff',
                'is_superuser',
            )
        }),
    )
    # ユーザー追加
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'name',
                'email',
                # 'image',
                'password1',
                'password2',
                'is_active',
                'is_staff',
                'is_superuser',
            ),
        }),
    )

    # ユーザー一覧
    list_display = (
        'id',
        'name',
        'email',
        'is_active',
        'organization',
        'is_staff',
        'is_superuser',
    )

    list_filter = ()
    # 検索
    search_fields = ('email',)
    # 順番
    ordering = ('id',)


admin.site.register(User, UserAdminCustom)
admin.site.register(Permission)
admin.site.register(Organization)
admin.site.register(OrganizationMember)