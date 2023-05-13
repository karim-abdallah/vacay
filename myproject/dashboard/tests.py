from authentication.models import TimeOffSetting, User
from django.test import TestCase
from django.urls import reverse


# Create your tests here.
class TestTimeOffSettingsDetail(TestCase):
    def setUp(self) -> None:
        # Uses request factory for reach test
        self.user = User.objects.create(
            first_name="Jean-Claude",
            last_name="La Serrure",
            email="jeanclaude@laserrure.com",
            password="jeanclaude69",
            username="jeanclaude",
        )
        self.time_off_setting = TimeOffSetting.objects.create(
            user_id=self.user,
            time_off_type="pto",
            accrual_type="accrual",
            annual_allowance_days=20,
            accrual_cap_days=0,
            current_balance_days=5,
        )

    def test_get(self) -> None:
        # Arrange
        self.client.login(username=self.user.username,
                          password=self.user.password)
        url = reverse("time-off-setting-detail", kwargs={"id": self.user.id})

        # Act
        # TODO: figure out how to get around authentication issues... need to issue
        # a token
        response = self.client.get(url)

        # Assert
        self.assertEqual(response.status_code, 200)
