import datetime

import jwt
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenViewBase

from .models import *
from .serializers import (SubscriptionsSerializer,
                          TokenObtainLifetimeSerializer, UserSerializer)
from .utils import (check_or_create_username,
                    get_google_oauth_link, get_google_oauth_user_info,
                    get_facebook_oauth_link, get_facebook_oauth_user_info,get_or_generate_facebook_email, serialize_provider_object,
                    send_forget_password_email, send_invite_email,
                    send_register_user_email)

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

        if 'type' not in data:
            data['type'] = 'personal'

        serializer = UserSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        serializer.save()

        TimeOffSetting.objects.create(user_id=serializer.data["id"])

        send_register_user_email(data["email"], data["first_name"])

        response = {"data": serializer.data}

        return Response(response, status=status.HTTP_201_CREATED)


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

        response = {
            "detail": "A password reset link has been sent to your email address"}

        return Response(response, status=status.HTTP_200_OK)


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
        return Response({"data": serializer.data})


class SendInviteView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        send_invite_email(data['emails'])
        return Response({"detail": "Invitations Sent Successfully"})


class OAuthLinkView(APIView):

    def get(self, request):
        oauth_provider = request.GET.get('oauth_provider', None)

        if oauth_provider == 'google':
            link = get_google_oauth_link()
        elif oauth_provider == 'facebook':
            link = get_facebook_oauth_link()
        else:
            return Response({"detail": "Invalid Oauth provider"}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"data": link})


class OAuthVerifyView(APIView):
    def post(self, request):
        data = request.data

        provider = data['provider']
        is_existing = False

        if provider == 'google':
            result = get_google_oauth_user_info(data['access_token'])

            if 'error' in result:
                response = {'detail': 'invalid/expired token'}
                return Response(response, status=status.HTTP_406_NOT_ACCEPTABLE)

        elif provider == 'facebook':
            result = get_facebook_oauth_user_info(data['code'])

            if 'error' in result:
                response = {'detail': 'invalid/expired token'}
                return Response(response, status=status.HTTP_406_NOT_ACCEPTABLE)

        # create user if not exist
        try:

            if 'email' not in result and provider == 'facebook':
                result['email'] = get_or_generate_facebook_email(result['id'], result['first_name'])
            
            user = User.objects.get(email=result['email'])
            is_existing = True

        except User.DoesNotExist:
            user = serialize_provider_object(result, provider)
 
            if not user:
                response = {'detail': 'unsupported provider'}
                return Response(response, status=status.HTTP_406_NOT_ACCEPTABLE)

            user.save()

            TimeOffSetting.objects.create(user_id=user.id)

        # generate token without username & password
        token = RefreshToken.for_user(user)

        response = {'data': {}}
        response['data']['access_token'] = str(token.access_token)
        response['data']['refresh_token'] = str(token)
        response['data']['is_existing'] = is_existing

        return Response(response, status=status.HTTP_201_CREATED)
