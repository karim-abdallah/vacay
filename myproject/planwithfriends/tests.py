from django.test import TestCase
from authentication.models import User, TimeOffSetting
from planwithfriends.models import Guest, Group
from planwithfriends.views import GroupListView, GroupView
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
            )
            self.guest_2 = Guest.objects.create(
                group=self.group,
                user=self.group_guest_2,
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
        self.first_group_name = "Trip to LA"
        self.second_group_name = "Crans Montana"
        self.groups = [
            self.MockGroup(self.first_group_name, self.group_organizer),
            self.MockGroup(self.second_group_name, self.group_organizer),
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
            group.guest_1.save()
            group.guest_2.save()

        # Act
        request = self.factory.get("/planwithfriends/groups")
        force_authenticate(request, user=user)

        response = self.view(request)

        # Assert
        assert response
        assert len(response.data) == 2
        for group in response.data:
            assert group["group_info"]["organizer"] == user.id
            # Assert that right groups are pulled
            assert group["group_info"]["group_name"] in (
                self.first_group_name,
                self.second_group_name,
            )

            # Assert that correct guests are pulled
            if group["group_info"]["group_name"] == self.first_group_name:
                assert group["guests"][0]["email"] in (
                    self.groups[0].group_guest_1.email,
                    self.groups[0].group_guest_2.email,
                )
                assert group["guests"][1]["email"] in (
                    self.groups[0].group_guest_1.email,
                    self.groups[0].group_guest_2.email,
                )
            else:
                assert group["guests"][0]["email"] in (
                    self.groups[1].group_guest_1.email,
                    self.groups[1].group_guest_2.email,
                )
                assert group["guests"][1]["email"] in (
                    self.groups[1].group_guest_1.email,
                    self.groups[1].group_guest_2.email,
                )

            for guest in group["guests"]:
                assert guest["dashboard"]
                assert guest["accepted_invitation"]

    def test_get_all_groups_guests_not_accepted_invitation_yet(self):
        """Tests that all relevant groups are fetched for organizer, assuming guests
        have not accepted invitations
        Verifies that:
        - All groups are fetched (count = 2)
        - Groups indicate current user as organizer
        - Groups fetch user info but hide dashboard data
        TODO: Confirm holidays and individual booked days are loaded. Confirm group booked days are loaded.
        """
        # Arrange
        user = self.group_organizer
        for group in self.groups:
            group.guest_1.accepted_invitation = False
            group.guest_2.accepted_invitation = False
            group.guest_1.save()
            group.guest_2.save()

        # Act
        request = self.factory.get("/planwithfriends/groups")
        force_authenticate(request, user=user)

        response = self.view(request)

        # Assert
        assert response
        assert len(response.data) == 2
        for group in response.data:
            assert group["group_info"]["organizer"] == user.id
            assert len(group["guests"]) == 2
            for guest in group["guests"]:
                assert guest["dashboard"]["booked_PTO"] == []
                assert not guest["accepted_invitation"]


class GroupTest(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = GroupView.as_view()
        self.group_organizer = User.objects.create(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            password="12345678",
            username=fake.word(),
            country="USA",
        )

    def test_create_new_group(self):
        """
        Tests happy path for creating new group
        """
        # Arrange
        group_name = fake.word()

        # Act
        request = self.factory.post(
            "/planwithfriends/group", {"group_name": group_name}
        )
        force_authenticate(request, user=self.group_organizer)

        response = self.view(request)

        created_group = Group.objects.filter(
            organizer_id=self.group_organizer.id
        ).first()

        # Assert
        assert response.status_code == 201
        assert created_group
        assert created_group.group_name == group_name
