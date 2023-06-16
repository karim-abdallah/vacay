import datetime
from urllib.parse import urlencode

import jwt
import requests
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.utils import json
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenViewBase

from .models import *
from .serializers import (SubscriptionsSerializer,
                          TokenObtainLifetimeSerializer, UserSerializer)
from .utils import (check_or_create_username, send_forget_password_email,
                    send_invite_email, send_register_user_email)

# COMMON CODE FOR AUTHENTICATION
"""
201: Login Success
401: No Token
402: Invalid Token
403: Expired Token
404: Wrong Password
405: Wrong Credentials
"""


class TokenObtainPairView(TokenViewBase):
    """
        Return JWT tokens (access and refresh) for specific user based on username and password.
    """
    serializer_class = TokenObtainLifetimeSerializer


class RegisterView(APIView):
    def post(self, request):

        data = request.data
        username = check_or_create_username(data["email"])

        data["username"] = username

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        TimeOffSetting.objects.create(user_id=serializer.data["id"])

        send_register_user_email(data["email"], data["first_name"])

        return Response({"data": serializer.data})


class GoogleView(APIView):
    def post(self, request):
        payload = {'access_token': request.data.get(
            "token")}  # validate the token
        r = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo', params=payload)
        data = json.loads(r.text)

        if 'error' in data:
            content = {
                'message': 'wrong google token / this google token is already expired.'}
            return Response(content)

        # create user if not exist
        try:
            user = User.objects.get(email=data['email'])
        except User.DoesNotExist:
            user = User()
            user.username = data['email']
            # provider random default password
            user.password = make_password(
                BaseUserManager().make_random_password())
            user.email = data['email']
            user.save()

        # generate token without username & password
        token = RefreshToken.for_user(user)
        response = {}
        response['username'] = user.username
        response['access_token'] = str(token.access_token)
        response['refresh_token'] = str(token)
        return Response(response)


class LogoutView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        response = Response()
        # response.delete_cookie("jwt")
        response.data = {"detail": "logout"}

        return response


class ForgotPasswordView(APIView):
    def post(self, request):

        email = request.data["email"]
        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed("User not found")

        # Create a JWT token with an expiry time of 60 minutes
        payload = {
            "user_id": user.id,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15),
            "iat": datetime.datetime.utcnow(),
            "type": "reset_password",
        }

        token = jwt.encode(payload, "secret", algorithm="HS256")

        # Create password reset URL
        reset_password_link = f"https://vacay.live/reset-password/{token}"

        send_forget_password_email(email, reset_password_link)

        return Response(
            {"data": "A password reset link has been sent to your email address"}
        )


class ResetPasswordView(APIView):
    def post(self, request):

        token = request.data["token"]
        password = request.data["password"]

        # decode the JWT token and validate its contents
        try:

            payload = jwt.decode(token, "secret", algorithms=["HS256"])

            if payload["type"] != "reset_password":
                raise AuthenticationFailed("Invalid token type")

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")

        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token")

        # get the user object
        # get_object_or_404 is used to get the object from the database if the object is not found it will return 404 error
        user = get_object_or_404(User, id=payload["user_id"])

        user.set_password(password)
        user.save()

        return Response({"detail": "Password reset successfully"})


class ChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        old_password = request.data["old_password"]
        new_password = request.data["new_password"]

        # get_object_or_404 is used to get the object from the database if the object is not found it will return 404 error
        user = get_object_or_404(User, id=request.user.id)

        is_correct = user.check_password(old_password)

        if not is_correct:
            raise AuthenticationFailed(detail="incorrect password", code=404)

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password updated successfully"})


class SubscribeView(APIView):
    def post(self, request):
        data = request.data
        email = data["email"]
        Subscriptions.objects.create(email=email)
        return Response({"detail": "Subscribed successfully"})

    def get(self, request):
        subscriptions = Subscriptions.objects.all()
        serializer = SubscriptionsSerializer(subscriptions, many=True)
        return Response(serializer.data)


class SendInviteView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        send_invite_email(data['emails'])
        return Response({"detail": "Invitations Sent Successfully"})


class HelloView(APIView):

    def get(self, request):

        url = 'https://accounts.google.com/o/oauth2/v2/auth?'
        encoded_params = urlencode({
            'client_id': '1059695905619-jf8o5bakj2eilj2nhlmuk4mbmvpdqe40.apps.googleusercontent.com',
            'redirect_uri': 'http://localhost:3000',
            'response_type': 'token',
            'scope': 'profile',
            'access_type':'offline'
        })

        encoded_url = url + encoded_params

        return Response(encoded_url)
