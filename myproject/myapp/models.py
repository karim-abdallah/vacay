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

    USERNAME_FIELD = 'email' # this is used to make the email field as the primary key
    REQUIRED_FIELDS = ['first_name','last_name','username'] # this is used to make the username field as the required field

class Subscriptions(models.Model):      
    email = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.email


