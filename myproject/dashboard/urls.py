from dashboard.views import *
from django.urls import path

urlpatterns = [
    path("user", UserView.as_view()),
    path("update-user", UpdateProfileView.as_view()),
    path("generate-presigned-url", GeneratePresignedUrl.as_view()),
    path("update-profile-picture", UpdateProfilePictureView.as_view()),
    path("time-off-settings", TimeOffSettingList.as_view(),
         name="time-off-settings"),
    path("holidays-settings", HolidaySettingView.as_view(), name="holiday-detail"),
    path("update-holidays-status", UpdateHolidayStatus.as_view(),
         name="update-holiday-status"),
    path("booked-days", BookedDaysView.as_view(), name="booked-days"),
]
