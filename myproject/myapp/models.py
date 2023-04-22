from django.contrib.auth.models import AbstractUser
from django.db import models



class User(AbstractUser):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True)



    # USERNAME_FIELD = 'email' # this is used to make the email field as the primary key
    # REQUIRED_FIELDS = ['first_name','last_name','username'] # this is used to make the username field as the required field


