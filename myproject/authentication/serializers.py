from rest_framework import exceptions, serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Subscriptions, User


class TokenObtainLifetimeSerializer(TokenObtainPairSerializer):
    
    def validate(self, attrs):
        user_type = 'personal'

        if 'type' in self.initial_data:
            user_type = self.initial_data['type']

        data = super().validate(attrs)

        ''' 
        here we check for user type, business users can only access business profile and personal users can only access personal profile
        if a personal user tries to access jarvis app, we will return the below error
        if a business user tries to access vacay app, we will return the below error
        if a business user is trying to login, we include the looker studio url in response as well in line no 32
        '''
        if user_type != self.user.type:
            error_message = "This profile is not registered with the domain"
            error_name = "expired_profile"
            raise exceptions.AuthenticationFailed(error_message, error_name)

        refresh = self.get_token(self.user)
        data['lifetime'] = int(refresh.access_token.lifetime.total_seconds())
        data['is_logged_in'] = self.user.is_logged_in

        if user_type == 'business':
            data['url'] = self.user.url

        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        
        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "password",
            "username",
            "profile_pic",
            "country",
            "last_login",
            
        ]

        # this is used to hide the password when we get the data from the database
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        # this is used to create a new user
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class SubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriptions
        fields = "__all__"