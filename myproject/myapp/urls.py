
from django.urls import path

from myapp.views import *

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('user', UserView.as_view()),
    path('update-user', UpdateProfileView.as_view()),
    path('logout', LogoutView.as_view()),
    path('forgot-password', ForgotPasswordView.as_view()),
    path('reset-password', ResetPasswordView.as_view()),
    path('change-password', ChangePasswordView.as_view()),
    path('generate-presigned-url', GeneratePresignedUrl.as_view()),
    path('update-profile-picture', UpdateProfilePictureView.as_view()),
    path('subscribe', SubscribeView.as_view()),
]
