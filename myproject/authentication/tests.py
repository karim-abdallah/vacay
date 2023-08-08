import datetime

from decimal import Decimal

from django.test import TestCase
from dashboard.views import TimeOffSettingList
from rest_framework.test import APIRequestFactory, force_authenticate
from authentication.models import (
    TimeOffSetting,
    User,
    TIME_OFF_CURRENT_BALANCE_DECIMAL_PRECISION,
)

# Create your tests here.


def calculate_month_offset(date1, date2):
    # Calculate the difference between the dates
    difference = date1 - date2

    # Calculate the month offset
    month_offset = (difference.days // 30) + (difference.days % 30 > 0)

    return month_offset


class TimeOffSettingsTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = TimeOffSettingList.as_view()
        self.annual_allowance = 12
        self.default_current_balance = 7
        self.user = User.objects.create(
            first_name="Jean Luc",
            last_name="Lapoutre",
            email="jeanluc@lapoutre.com",
            password="12345678",
            username="jeanluclapoutre",
            country="USA",
            type="personal"
        )
        self.time_off_settings = TimeOffSetting.objects.create(
            user=self.user,
            annual_allowance_days=self.annual_allowance,
            current_balance_days=self.default_current_balance,
        )

    def test_current_balance_updated(self):
        """Tests that the current balance is updated if today's month is ahead of the last recorded current balance"""

        # Arrange
        recorded_datetime = datetime.date(2023, 4, 5)
        self.time_off_settings.balance_recorded_date = recorded_datetime
        self.time_off_settings.save()

        # Act
        request = self.factory.get("/dashboard/time-off-settings")
        force_authenticate(request, user=self.user)

        response = self.view(request)

        # Assert
        assert response
        assert response.data[
            "current_balance_days"
        ] == self.default_current_balance + calculate_month_offset(
            datetime.date.today(), recorded_datetime
        )
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

    def test_current_balance_update_decimal_accrual_rate(self):
        """
        Tests specific case where accrual rate is not an integer.
        Expects updated balance to go to decimal precision.
        """

        # Arrange
        recorded_datetime = datetime.date(2023, 4, 5)
        annual_allowance = 17
        monthly_accrual_rate = 17 / 12
        self.time_off_settings.balance_recorded_date = recorded_datetime
        self.time_off_settings.annual_allowance_days = annual_allowance
        self.time_off_settings.save()

        # Act
        request = self.factory.get("/dashboard/time-off-settings")
        force_authenticate(request, user=self.user)

        response = self.view(request)

        # Assert
        expected_balance_increase = Decimal(
            calculate_month_offset(datetime.date.today(), recorded_datetime)
            * monthly_accrual_rate
        ).quantize(Decimal(f"1e{-TIME_OFF_CURRENT_BALANCE_DECIMAL_PRECISION}"))

        assert response
        assert (
            Decimal(response.data["current_balance_days"])
            == self.default_current_balance + expected_balance_increase
        )
        assert (
            response.data["balance_recorded_date"] == datetime.date.today().isoformat()
        )
