from authentication.models import User
from django.db import models


class Group(models.Model):
    group_name = models.CharField(max_length=100)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    booking_requested = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class FriendGroup(models.Model):
    """
    Mapping table that connects user IDs with groups they belong to
    """

    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    accepted_invitation = models.BooleanField(default=False)
    accepted_booking = models.BooleanField(null=True)


class TripDate(models.Model):
    """
    Mapping table that connects groups with booked dates
    """

    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    date = models.DateField()
