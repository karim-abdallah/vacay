from jarvishr.views import *
from django.urls import path

urlpatterns = [
    path("send-prompt", ChatBotView.as_view()),
    path("metrics", MetricsView.as_view()),
    path("sheet-data", SheetView.as_view()),
    path("retool-embed-link", RetoolEmbedAuth.as_view(), name="retool-embed-link"),
    path("workforce", WorkforceView.as_view(), name="workforce"),
]
