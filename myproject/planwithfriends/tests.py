from django.test import TestCase
from authentication.models import User, TimeOffSetting
from planwithfriends.models import Guest, Group
from planwithfriends.views import GroupListView
from rest_framework.test import APIRequestFactory, force_authenticate

from faker import Faker

fake = Faker()

# Create your tests here.
class GroupListTests(TestCase):
    class MockGroup:
        def __init__(self, group_name, organizer):
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
            self.group_owner_setting = TimeOffSetting.objects.create(user=organizer)
            self.group_guest_1_setting = TimeOffSetting.objects.create(
                user=self.group_guest_1
            )
            self.group_guest_2_setting = TimeOffSetting.objects.create(
                user=self.group_guest_2
            )
            self.group = Group.objects.create(
                organizer=organizer,
                group_name=group_name,
            )
            self.guest_1 = Guest.objects.create(
                group=self.group,
                user=self.group_guest_1,
                accepted_invitation=True,
            )
            self.guest_2 = Guest.objects.create(
                group=self.group,
                user=self.group_guest_2,
                accepted_invitation=True,
            )

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = GroupListView.as_view()
        self.group_organizer = User.objects.create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            password="12345678",
            username=fake.word(),
            country="USA",
        )
        self.groups = [
            self.MockGroup("Trip to LA", self.group_organizer),
            self.MockGroup("Crans Montana", self.group_organizer),
        ]

    def test_get_all_groups_for_organizer_happy_path(self):
        """Tests that all relevant groups are fetched for organizer, assuming guests
        have accepted invitations.
        Verifies that:
        - All groups are fetched (count = 2)
        - Groups indicate current user as organizer
        - Groups fetch relevant info (guests and time off settings)
        TODO: Confirm holidays and individual booked days are loaded. Confirm group booked days are loaded.
        """

        # Arrange
        user = self.group_organizer
        for group in self.groups:
            group.guest_1.accepted_invitation = True
            group.guest_2.accepted_invitation = True

        # Act
        request = self.factory.get("/planwithfriends/groups")
        force_authenticate(request, user=user)

        response = self.view(request)

        # Assert
        assert response
        assert len(response.data) == 2
        for group in response.data:
            assert group["group_info"]["organizer"] == user.id
            for guest in group["guests"]:
                assert guest["dashboard"]
