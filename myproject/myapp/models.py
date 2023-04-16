from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)
    username = None

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
