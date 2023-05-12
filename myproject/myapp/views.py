from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .serializers import (
    SubscriptionsSerializer,
    UserSerializer,
    TimeOffSettingSerializer,
)
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import *
import jwt
import datetime
from .utils import (
    send_forget_password_email,
    send_register_user_email,
    generate_presigned_url,
    check_or_create_username,
)
from rest_framework import status

# COMMON CODE FOR AUTHENTICATION
"""
201: Login Success
401: No Token
402: Invalid Token
403: Expired Token
404: Wrong Password
405: Wrong Credentials
"""


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


class LoginView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        user = User.objects.filter(email=email).first()
        
        if user is None:
            raise AuthenticationFailed("User not found!")

        if not user.check_password(password):
            raise AuthenticationFailed("Incorrect password!")

        payload = {
            "id": user.id,
            # exp stands for expiration time
            "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
            "iat": datetime.datetime.utcnow(),  # iat stands for issued at time
        }

        # HS256 is the algorithm used to encode the token
        token = jwt.encode(payload, "secret", algorithm="HS256")
     
        response = Response()
        
        
        # httponly is used to prevent javascript from accessing the cookie
        response.set_cookie(
            key="jwt", value=token, httponly=True, samesite="none", secure=False
        )
        
        response.data = {"token":token,"is_logged_in":user.is_logged_in}

        return response



class UserView(APIView):
    def get(self, request):
        token = request.headers["Authorization"].split("Bearer ")[
            1
        ]  # get the token from the cookie

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        # get the user from the payload

        user = User.objects.filter(id=payload["id"]).first()
        
        serializer = UserSerializer(user)

        return Response(serializer.data)

    def put(self,request):
        token = request.headers["Authorization"].split("Bearer ")[
            1
        ]
        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        user = User.objects.filter(id=payload["id"]).first()
        user.is_logged_in = True
        user.save()

        return Response({"data":"User Successfully Updated"})


class LogoutView(APIView):
    def post(self, request):

        response = Response()
        response.delete_cookie("jwt")
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
    def post(self, request):

        # token = request.COOKIES.get('jwt')
        token = request.headers["Authorization"].split("Bearer ")[1]

        old_password = request.data["old_password"]
        new_password = request.data["new_password"]

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        # get_object_or_404 is used to get the object from the database if the object is not found it will return 404 error
        user = get_object_or_404(User, id=payload["id"])

        is_correct = user.check_password(old_password)

        if not is_correct:
            raise AuthenticationFailed(detail="incorrect password", code=404)

        user.set_password(new_password)
        user.save()

        return Response({"detail": "Password updated successfully"})


class UpdateProfileView(APIView):
    def post(self, request):

        # token = request.COOKIES.get('jwt')
        token = request.headers["Authorization"].split("Bearer ")[1]

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        data = request.data

        # get_object_or_404 is used to get the object from the database if the object is not found it will return 404 error
        user = get_object_or_404(User, id=payload["id"])

        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        user.save()

        return Response({"detail": "Profile updated successfully"})


class UpdateProfilePictureView(APIView):
    def post(self, request):

        # token = request.COOKIES.get('jwt')
        token = request.headers["Authorization"].split("Bearer ")[1]

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        data = request.data
        file_name = data["file_name"]

        # get_object_or_404 is used to get the object from the database if the object is not found it will return 404 error
        user = get_object_or_404(User, id=payload["id"])

        link = f"https://vacay-assets.s3.amazonaws.com/users/{user.username}/profile/{file_name}"

        user.profile_pic = link
        user.save()

        return Response({"detail": "Profile picture updated successfully"})


class GeneratePresignedUrl(APIView):
    def post(self, request):

        # token = request.COOKIES.get('jwt')
        token = request.headers["Authorization"].split("Bearer ")[1]

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        data = request.data

        user = get_object_or_404(User, id=payload["id"])

        link = generate_presigned_url(
            user.username, data["file_name"], data["file_type"]
        )

        return Response({"detail": link})


class TimeOffSettingList(APIView):
    """
    Retrive time off settings
    """

    def get(self, request):
        """
        Get time off settings for a specific requesting user
        """
        token = request.headers["Authorization"].split("Bearer ")[1]

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            payload = jwt.decode(token, "secret", algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        time_off_setting = get_object_or_404(TimeOffSetting, user_id=payload["id"])

        return Response(TimeOffSettingSerializer(time_off_setting).data)

    def put(self, request):
        """
        Update specific time off setting object

        Right now assumes there is a 1:1 mapping from user to time off setting
        In the future, there will be 1:many.
        """
        token = request.headers["Authorization"].split("Bearer ")[1]
        data = request.data

        if not token:
            raise AuthenticationFailed("Unauthenticated")

        try:
            token_payload = jwt.decode(token, "secret", algorithms=["HS256"])

        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Unauthenticated")

        user = get_object_or_404(User, id= token_payload["id"])
        user.country= data["country"]
        user.save()

        time_off_setting_to_update = get_object_or_404(
            TimeOffSetting, user_id=token_payload["id"]
        )

        serializer = TimeOffSettingSerializer( time_off_setting_to_update, data=data )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
     
    

