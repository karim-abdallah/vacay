from django.shortcuts import render, get_object_or_404
from authentication.models import User
from authentication.models import BookedDays, HolidaySetting, TimeOffSetting
from dashboard.serializers import (
    BookedDaysSerializer,
    HolidaySettingSerializer,
    TimeOffSettingSerializer,
)
from planwithfriends.serializers import DashboardSerializer, GroupDataSerializer
from planwithfriends.serializers import GuestSerializer

from planwithfriends.models import Guest, Group

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.


class GroupListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve all groups data for a given user
        """

        id = request.user.id
        get_object_or_404(User, id=id)

        # Fetch all groups where user is organizer
        organized_groups = Group.objects.filter(organizer_id=id).all()
        # Fetch all groups where user is a guest
        guest_groups = Guest.objects.filter(user_id=id).all()

        # Extract all groups relevant to user
        all_groups = [g.group for g in guest_groups]

        for group in organized_groups:
            all_groups.append(group)

        group_data_serializers = []

        # For each group, fetch relevant data
        for group in all_groups:
            guests = Guest.objects.filter(group_id=group.id).all()
            guest_serializers = []

            for guest in guests:
                guest_profile = User.objects.filter(id=guest.id).first()
                guest_serializer = {
                    "name": f"{guest_profile.first_name} {guest_profile.last_name}",
                    "email": guest_profile.email,
                    "username": guest_profile.username,
                    "profile_pic": guest_profile.profile_pic,
                    "accepted_invitation": guest.accepted_invitation,
                    "accepted_booking": guest.accepted_booking,
                }
                # Only load dashboard data if friend has accepted request
                # or if friend is self
                if guest.accepted_invitation or guest.user_id == id:
                    booked_PTO = BookedDays.objects.filter(user_id=guest.id).all()
                    holidays = HolidaySetting.objects.filter(user_id=guest.id).all()
                    time_off_setting = TimeOffSetting.objects.filter(
                        user_id=guest.id
                    ).first()

                    dashboard_serializer = {
                        "booked_PTO": booked_PTO,
                        "holidays": holidays,
                        "time_off_setting": time_off_setting,
                    }

                    guest_serializer["dashboard"] = dashboard_serializer

                guest_serializers.append(guest_serializer)

            group_data_serializers.append(
                {
                    "group_info": group,
                    "guests": guest_serializers,
                }
            )

        serializer = GroupDataSerializer(group_data_serializers, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class GroupView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        """
        Create new group
        """

        id = request.user.id
        data = request.data

        new_group = {
            "group_name": data.get("group_name", ""),
            "organizer_id": id,
        }

        Group.objects.create(**new_group)

        return Response(
            {"detail": "Group Created Successfully"}, status=status.HTTP_201_CREATED
        )
