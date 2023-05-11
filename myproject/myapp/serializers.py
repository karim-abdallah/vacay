from rest_framework import serializers
from .models import TimeOffSetting, User, Subscriptions


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


class TimeOffSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeOffSetting
        fields = [
            "id",
            "user_id",
            "time_off_type",
            "accrual_type",
            "annual_allowance_days",
            "accrual_cap_days",
            "current_balance_days",
        ]

    def create(self, validated_data):
        # Creates new Time Off Settings entry
        instance = self.Meta.model.create(**validated_data)
        return instance

    def update(self, instance, validated_data):
        # Updates existing Time Off Settings entry
        instance.time_off_type = validated_data.get(
            "time_off_type", instance.time_off_type
        )
        instance.accrual_type = validated_data.get(
            "accrual_type", instance.accrual_type
        )
        instance.annual_allowance_days = validated_data.get(
            "annual_allowance_days", instance.annual_allowance_days
        )
        instance.accrual_cap_days = validated_data.get(
            "accrual_cap_days", instance.accrual_cap_days
        )
        instance.current_balance_days = validated_data.get(
            "current_balance_days", instance.current_balance_days
        )

        instance.save()
        return instance


class SubscriptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscriptions
        fields = "__all__"
