from dashboard.serializers import TimeOffSettingSerializer
from planwithfriends.models import Group, Guest, TripDate
from dashboard.serializers import BookedDaysSerializer, HolidaySettingSerializer
from rest_framework import serializers


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"


class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = "__all__"


class TripDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripDate
        fields = "__all__"


class DashboardSerializer(serializers.Serializer):
    booked_PTO = BookedDaysSerializer(many=True)
    holidays = HolidaySettingSerializer(many=True)
    time_off_setting = TimeOffSettingSerializer()


class GuestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    username = serializers.CharField(max_length=100)
    profile_pic = serializers.CharField(max_length=100)
    accepted_invitation = serializers.BooleanField()
    accepted_booking = serializers.BooleanField(allow_null=True)
    dashboard = DashboardSerializer(required=False)


class GroupDataSerializer(serializers.Serializer):
    group_info = GroupSerializer()
    guests = GuestSerializer(many=True)
