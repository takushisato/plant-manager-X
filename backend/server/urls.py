"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
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
from django.urls import path, include
from django.conf import settings
from apps.staff_hub.views import CustomUserMeView
from apps.staff_hub.views import AllUsersView

urlpatterns = [
    # 管理者ページ
    path("admin/", admin.site.urls),
    # djoser
    path(
        "api/auth/custom/users/me/", CustomUserMeView.as_view(), name="custom-user-me"
    ),
    path("api/", include("rest_framework.urls")),
    path("api/auth/", include("djoser.urls.authtoken")),
    path("api/auth/all_users/", AllUsersView.as_view(), name="all-users"),
    # path('api/auth/', include('djoser.urls')), # ログイン、ログアウト、パスワード変更など。一旦コメントアウト
    # apps
    path("api/materials/", include("apps.material.urls")),
    path("api/mail/", include("apps.mail.urls")),
    path("api/production/", include("apps.prod_flow.urls")),
    path("api/trade/", include("apps.trade_flow.urls")),
    path("api/bug_note/", include("apps.bug_note.urls")),
    path("api/attendance/", include("apps.attendance.urls")),
]

if settings.DEBUG:
    from drf_spectacular.views import (
        SpectacularAPIView,
        SpectacularSwaggerView,
        SpectacularRedocView,
    )
    import debug_toolbar

    urlpatterns += [
        path("api/schema.json/", SpectacularAPIView.as_view(), name="schema"),
        path(
            "api/schema/redoc/",
            SpectacularRedocView.as_view(url_name="schema"),
            name="redoc",
        ),
        path(
            "api/schema/swagger/",
            SpectacularSwaggerView.as_view(url_name="schema"),
            name="swagger",
        ),
        path("__debug__/", include(debug_toolbar.urls)),
    ]
