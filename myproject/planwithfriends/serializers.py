from planwithfriends.models import Group, FriendGroup, TripDate
from dashboard.serializers import BookedDaysSerializer, HolidaySettingSerializer
from rest_framework import serializers


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"


class FriendGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendGroup
        fields = "__all__"


class TripDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TripDate
        fields = "__all__"


class DashboardSerializer(serializers.Serializer):
    booked_PTO = BookedDaysSerializer(many=True)
    holidays = HolidaySettingSerializer(many=True)


class FriendSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    username = serializers.CharField(max_length=100)
    profile_pic = serializers.CharField(max_length=100)
    dashboard = DashboardSerializer


class GroupDataSerializer:
    group_info = GroupSerializer()
    friends = FriendSerializer(many=True)
