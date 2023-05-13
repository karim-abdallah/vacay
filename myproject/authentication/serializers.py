from rest_framework import serializers

from .models import User, Subscriptions


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class TokenObtainLifetimeSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)
        data['lifetime'] = int(refresh.access_token.lifetime.total_seconds())
        data['is_logged_in'] = self.user.is_logged_in
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
            "last_login"
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