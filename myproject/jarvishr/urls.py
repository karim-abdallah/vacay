from jarvishr.views import *
from django.urls import path

urlpatterns = [
    path("send-prompt", ChatBotView.as_view()),
    path("metrics", MetricsView.as_view()),
]
