from authentication.views import *
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path('login', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify', TokenVerifyView.as_view(), name='token_verify'),
    path("register", RegisterView.as_view()),
    path("logout", LogoutView.as_view()),
    path("forgot-password", ForgotPasswordView.as_view()),
    path("reset-password", ResetPasswordView.as_view()),
    path("change-password", ChangePasswordView.as_view()),
    path("subscribe", SubscribeView.as_view()),
    path("send-invites", SendInviteView.as_view(), name='send-invites')
]
