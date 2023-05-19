import datetime
from django.test import TestCase
from dashboard.views import TimeOffSettingList
from rest_framework.test import APIRequestFactory, force_authenticate
from authentication.models import TimeOffSetting, User

# Create your tests here.


class TimeOffSettingsTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = TimeOffSettingList.as_view()
        self.default_accrual_cap = 12
        self.default_current_balance = 7
        self.user = User.objects.create(
            first_name="Jean Luc",
            last_name="Lapoutre",
            email="jeanluc@lapoutre.com",
            password="12345678",
            username="jeanluclapoutre",
            country="USA",
        )
        self.time_off_settings = TimeOffSetting.objects.create(
            user=self.user,
            accrual_cap_days=self.default_accrual_cap,
            current_balance_days=self.default_current_balance,
        )

    def test_current_balance_updated(self):
        """Tests that the current balance is updated if today's month is ahead of the last recorded current balance"""

        # Arrange
        self.time_off_settings.balance_recorded_date = datetime.date(2023, 4, 5)
        self.time_off_settings.save()

        # Act
        request = self.factory.get("/dashboard/time-off-settings")
        force_authenticate(request, user=self.user)

        response = self.view(request)

        # Assert
        assert response
        assert response.data["current_balance_days"] == 8
        assert (
            response.data["balance_recorded_date"] == datetime.date.today().isoformat()
        )

    def test_current_balance_same(self):
        """Tests that the current balance doesn't change if the month hasn't changed yet"""

        # Arrange
        self.time_off_settings.balance_recorded_date = datetime.date.today()
        self.time_off_settings.save()

        # Act
        request = self.factory.get("/dashboard/time-off-settings")
        force_authenticate(request, user=self.user)

        response = self.view(request)

        # Assert
        assert response
        assert response.data["current_balance_days"] == self.default_current_balance
        assert (
            response.data["balance_recorded_date"] == datetime.date.today().isoformat()
        )
