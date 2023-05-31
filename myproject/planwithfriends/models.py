from authentication.models import User
from django.db import models


class Group(models.Model):
    group_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class FriendGroup(models.Model):
    """
    Mapping table that connects user IDs with groups they belong to
    """

    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)


class TripDate(models.Model):
    """
    Mapping table that connects groups with booked dates
    """

    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    date = models.DateField()
