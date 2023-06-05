from django.shortcuts import render, get_object_or_404
from authentication.models import User

from planwithfriends.models import Group

from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

# Create your views here.
class GroupListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retrieve all groups data for a given user
        """

        id = request.user.id
        get_object_or_404(User, id=id)

        groups = Group.objects.filter(organizer_id=id).all()

        group_data_serializers = []
        # For each group, fetch relevant data

        for group in groups:
            print(group)
