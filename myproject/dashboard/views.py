import datetime
from authentication.models import HolidaySetting, TimeOffSetting, User
from authentication.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import HolidaySettingSerializer, TimeOffSettingSerializer
from .utils import generate_presigned_url

# Create your views here.


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        id = request.user.id

        user = User.objects.filter(id=id).first()

        serializer = UserSerializer(user)

        return Response(serializer.data)


class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        id = request.user.id
        data = request.data

        # get_object_or_404 is used to get the object from the database if the object is not found it will return 404 error
        user = get_object_or_404(User, id=id)

        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        user.save()

        return Response({"detail": "Profile updated successfully"})


class UpdateProfilePictureView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        id = request.user.id
        data = request.data
        file_name = data["file_name"]

        # get_object_or_404 is used to get the object from the database if the object is not found it will return 404 error
        user = get_object_or_404(User, id=id)

        link = f"https://vacay-assets.s3.amazonaws.com/users/{user.username}/profile/{file_name}"

        user.profile_pic = link
        user.save()

        return Response({"detail": "Profile picture updated successfully"})


class GeneratePresignedUrl(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        id = request.user.id
        data = request.data

        user = get_object_or_404(User, id=id)

        link = generate_presigned_url(
            user.username, data["file_name"], data["file_type"]
        )

        return Response({"detail": link})


class TimeOffSettingList(APIView):
    """
    Retrive time off settings
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Get time off settings for a specific requesting user
        """

        id = request.user.id

        time_off_setting = get_object_or_404(TimeOffSetting, user_id=id)

        # Update current balance if applicable
        # 1. calculate difference between today's month and recorded month
        # 2. if diff > 0 -> set new current balance as current balance + accrual rate * month diff
        today_month = datetime.date.today().month
        month_diff = today_month - time_off_setting.balance_recorded_date.month

        time_off_setting.current_balance_days = (
            time_off_setting.current_balance_days
            + time_off_setting.annual_allowance_days / 12 * month_diff
        )
        time_off_setting.balance_recorded_date = datetime.date.today()

        time_off_setting.save()

        return Response(TimeOffSettingSerializer(time_off_setting).data)

    def put(self, request):
        """
        Update specific time off setting object

        Right now assumes there is a 1:1 mapping from user to time off setting
        In the future, there will be 1:many.
        """

        id = request.user.id
        data = request.data

        user = get_object_or_404(User, id=id)
        user.country = data.get("country", user.country)
        user.is_logged_in = True
        user.save()

        time_off_setting_to_update = get_object_or_404(TimeOffSetting, user_id=id)

        serializer = TimeOffSettingSerializer(time_off_setting_to_update, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HolidaySettingView(APIView):
    def get(self, request):

        id = request.user.id
        data = request.data

        country = User.objects.get(id=id).country

        # Add static holiday data to the list of holidays
        holidays = [
            {
                "country": "France",
                "name": "New Year's Day France",
                "date": "January 1st, 2023",
                "active": False,
            },
            # // TODO: Add more static holiday data
            {
                "country": "US",
                "name": "New Year's Day US",
                "date": "January 2nd, 2023",
                "active": True,
            },
            # // TODO: Add more static holiday data
            {
                "country": "Other",
                "name": "New Year's Day Other",
                "date": "January 1st, 2023",
                "active": True,
            },
            # // TODO: Add more static holiday data
        ]

        # Retrieve all holiday data from the database and append to the list of holidays
        holidays_from_db = HolidaySetting.objects.all()
        for holiday in holidays_from_db:
            holidays.append(
                {
                    "country": holiday.country,
                    "name": holiday.name,
                    "date": holiday.date,
                    "active": holiday.active,
                }
            )
        selected_country = []
        for holiday in holidays:
            if holiday["country"] == country:
                selected_country.append(holiday)
        serializer = HolidaySettingSerializer(selected_country, many=True)
        return Response(serializer.data)

    def post(self, request):

        id = request.user.id
        data = request.data

        data.country = User.objects.get(id=id).country

        serializer = HolidaySettingSerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
