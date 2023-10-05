from django.contrib.auth.models import AbstractUser
from django.db import models


TIME_OFF_CURRENT_BALANCE_DECIMAL_PRECISION = 10


class User(AbstractUser):
    class ProivderType(models.TextChoices):
        EMAIL = "email", ""
        FACEBOOK = "facebook", ""
        GOOGLE = "google", ""

    class UserType(models.TextChoices):
        PERSONAL = "personal", ""
        BUSINESS = "business", ""

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)
    profile_pic = models.CharField(max_length=500, null=True)
    is_logged_in = models.BooleanField(default=False)
    country = models.CharField(max_length=100, null=True)
    provider = models.CharField(
        max_length=25, choices=ProivderType.choices, default=ProivderType.EMAIL)
    type = models.CharField(
        max_length=25, choices=UserType.choices, default=UserType.PERSONAL)
    looker_studio_url = models.URLField(max_length=5000, null=True, blank=True)
    data_source_url =  models.URLField(null=True, blank=True)

    USERNAME_FIELD = "email"  # this is used to make the email field as the primary key

    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "username"
    ]  # this is used to make the username field as the required field


class CompanyGsheetSource(models.Model):

    """
    We use the convention that the first worksheet in a group is the workforce
    data, and the second is the applicants data.
    """
    company_name = models.CharField(max_length=100, unique=True)
    gsheet_name = models.CharField(max_length=100, null=True, blank=True)
    gsheet_id = models.URLField(null=True, blank=True)


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
    current_balance_days = models.DecimalField(
        max_digits=13, decimal_places=10, default=7
    )
    balance_recorded_date = models.DateField(
        auto_now_add=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class HolidaySetting(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True)
    country = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    date = models.CharField(max_length=100)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class BookedDays(models.Model):
    class TimeOffType(models.TextChoices):
        PTO = "pto", ""
        HOLIDAYS = "holidays", ""
        SICK_DAYS = "sick_days", ""

    user = models.ForeignKey(User, on_delete=models.PROTECT)
    date = models.DateField()
    time_off_type = models.CharField(
        max_length=20, choices=TimeOffType.choices, default=TimeOffType.PTO
    )
    tag = models.CharField(max_length=25, blank=True, null=True)


class Metric(models.Model):
    metric = models.CharField(max_length=100)
    definition = models.CharField(max_length=250)
    formula = models.CharField(max_length=250)

    def __str__(self):
        return self.metric