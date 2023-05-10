from django.contrib.auth.models import AbstractUser
from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response


class User(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    profile_pic = models.CharField(max_length=100, null=True)

    USERNAME_FIELD = "email"  # this is used to make the email field as the primary key
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "username",
    ]  # this is used to make the username field as the required field


class Subscriptions(models.Model):
    email = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.email


class TimeOffSetting(models.Model):
    class TimeOffType(models.TextChoices):
        PTO = "pto", ""
        HOLIDAYS = "holidays", ""
        SICK_DAYS = "sick_days", ""

    class PolicyType(models.TextChoices):
        ACCRUAL = "accrual", ""
        LUMP_SUM = "lump_sump", ""
        UNLIMITED = "unlimited", ""

    user = models.ForeignKey(User, on_delete=models.PROTECT)
    time_off_type = models.CharField(
        max_length=100, choices=TimeOffType.choices, default=TimeOffType.PTO
    )
    policy_type = models.CharField(
        max_length=100, choices=PolicyType.choices, default=PolicyType.ACCRUAL
    )
    annual_allowance_days = models.IntegerField(null=True)
    accrual_cap_days = models.IntegerField(null=True)
    current_balance_days = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
