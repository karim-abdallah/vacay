from django.test import TestCase
from authentication.models import User, TimeOffSetting
from planwithfriends.models import FriendGroup, Group
from planwithfriends.views import GroupListView
from rest_framework.test import APIRequestFactory, force_authenticate

from faker import Faker

fake = Faker()

# Create your tests here.
class GroupListTests(TestCase):
    class MockGroup:
        def __init__(self, group_name):
            self.group_organizer = User.objects.create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                password="12345678",
                username=fake.word(),
                country="USA",
            )
            self.group_guest_1 = User.objects.create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                password="12345678",
                username=fake.word(),
                country="USA",
            )
            self.group_guest_2 = User.objects.create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                password="12345678",
                username=fake.word(),
                country="USA",
            )
            self.group_owner_setting = TimeOffSetting.objects.create(
                user=self.group_organizer
            )
            self.group_guest_1_setting = TimeOffSetting.objects.create(
                user=self.group_guest_1
            )
            self.group_guest_2_setting = TimeOffSetting.objects.create(
                user=self.group_guest_2
            )
            self.group = Group.objects.create(
                group_name=group_name, organizer=self.group_organizer
            )
            self.friend_group_1 = FriendGroup.objects.create(
                group=self.group,
                user=self.group_guest_1,
            )
            self.friend_group_2 = FriendGroup.objects.create(
                group=self.group,
                user=self.group_guest_2,
            )

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = GroupListView.as_view()
        self.groups = [
            self.MockGroup("Trip to LA"),
            self.MockGroup("Crans Montana"),
        ]

    def test_get_all_groups_for_organizer(self):
        """Tests that all relevant groups are fetched for organizer"""

        # Arrange
        user = self.groups[0].group_organizer

        # Act
        request = self.factory.get("/planwithfriends/groups")
        force_authenticate(request, user=user)

        response = self.view(request)

        # Assert
        assert response
