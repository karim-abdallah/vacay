from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    profile_pic = models.CharField(max_length=100, null=True)
    is_logged_in = models.BooleanField(default=False)
    country = models.CharField(max_length=100, null=True)

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

    class AccrualType(models.TextChoices):
        ACCRUAL = "accrual", ""
        LUMP_SUM = "lump_sump", ""
        UNLIMITED = "unlimited", ""

    user = models.ForeignKey(User, on_delete=models.PROTECT)
    time_off_type = models.CharField(
        max_length=100, choices=TimeOffType.choices, default=TimeOffType.PTO
    )
    accrual_type = models.CharField(
        max_length=100, choices=AccrualType.choices, default=AccrualType.ACCRUAL
    )
    annual_allowance_days = models.IntegerField(default=15)
    accrual_cap_days = models.IntegerField(default=24)
    current_balance_days = models.IntegerField(default=7)
    balance_recorded_date = models.DateField(
        auto_now_add=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class HolidaySetting(models.Model):
    country = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    date = models.CharField(max_length=100)
    active = models.BooleanField(default=False)

    def __str__(self):
        return self.name
