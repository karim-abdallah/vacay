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

    USERNAME_FIELD = 'email'  # this is used to make the email field as the primary key
    # this is used to make the username field as the required field
    REQUIRED_FIELDS = ['first_name', 'last_name', 'username']


class Subscriptions(models.Model):
    email = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.email


class UserPreferences(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    policy_type = models.CharField(max_length=20)
    annual_allowance = models.IntegerField()
    annual_contribution = models.IntegerField()
    current_balance = models.IntegerField()
    country = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username
