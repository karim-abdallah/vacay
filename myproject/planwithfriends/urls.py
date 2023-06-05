from planwithfriends.views import *
from django.urls import path

urlpatterns = [
    path("groups", GroupListView.as_view()),
]
