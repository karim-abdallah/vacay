import datetime
from authentication.models import HolidaySetting, TimeOffSetting, User, BookedDays
from authentication.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import json 

from .serializers import BookedDaysSerializer, HolidaySettingSerializer, TimeOffSettingSerializer
from .utils import generate_presigned_url, holidays

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

        time_off_setting_to_update = get_object_or_404(
            TimeOffSetting, user_id=id)

        serializer = TimeOffSettingSerializer(
            time_off_setting_to_update, data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HolidaySettingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        id = request.user.id

        holidays_from_db = HolidaySetting.objects.filter(user_id=id).all()

        serializer = HolidaySettingSerializer(holidays_from_db, many=True)
        return Response(serializer.data)

    def post(self, request):

        data = request.data
        data['user_id'] = request.user.id

        holidays_by_country = holidays(data['country'])

        for i in holidays_by_country:
            data['name'] = i['name']
            data['date'] = i['date']

            HolidaySetting.objects.create(**data)

        return Response({'detail': "Records Created Successfully"}, status=status.HTTP_201_CREATED)


class UpdateHolidayStatus(APIView):

    def post(self, request):

        data = request.data
        data['user_id'] = self.request.user.id
        country = User.objects.get(id=data['user_id']).country
        data['country'] = country

        HolidaySetting.objects.create(**data)

        return Response({'detail': "Records Created Successfully"}, status=status.HTTP_201_CREATED)

    def patch(self, request):
        data = request.data
        data['user_id'] = self.request.user.id
        holiday_settings = HolidaySetting.objects.filter(id=data['id'])
        holiday_settings.update(**data)

        return Response({'detail': "Records Updated Successfully"}, status=status.HTTP_200_OK)


        return Response(serializer.data, status=status.HTTP_200_OK)
    



class BookedDaysView(APIView):
    def post(self, request):

        data = request.data
        user = self.request.user.id
       
        data['dates'] = [i.split('T')[0] for i in data['dates']]
        dates = data['dates']

        for i in dates:
            BookedDays.objects.create(user_id=user, date=i)

        return Response({'detail': "Records Created Successfully"}, status=status.HTTP_201_CREATED)

        
    def get(self, request):

        user = self.request.user.id
        booked_days = BookedDays.objects.filter(user_id=user).all()
        serializer=BookedDaysSerializer(booked_days, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        
        data = request.data
        user = self.request.user.id
        data['dates'] = [i.split('T')[0] for i in data['dates']]
        dates = data['dates']
    
        for i in dates:
            BookedDays.objects.filter(user_id=user, date=i).delete()

        return Response({'detail': "Records Deleted Successfully"}, status=status.HTTP_202_ACCEPTED)

