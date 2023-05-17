from dashboard.views import *
from django.urls import path

urlpatterns = [
    path("user", UserView.as_view()),
    path("update-user", UpdateProfileView.as_view()),
    path("generate-presigned-url", GeneratePresignedUrl.as_view()),
    path("update-profile-picture", UpdateProfilePictureView.as_view()),
    path(
        "time-off-settings",
        TimeOffSettingList.as_view(),
        name="time-off-setting-detail",
    ),
    path("holidays-settings", HolidaySettingView.as_view(), name="holiday-detail")
]
