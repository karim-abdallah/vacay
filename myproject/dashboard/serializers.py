from authentication.models import HolidaySetting, TimeOffSetting
from rest_framework import serializers


class TimeOffSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeOffSetting
        fields = [
            "id",
            "user_id",
            "time_off_type",
            "policy_type",
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


class HolidaySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HolidaySetting
        fields = "__all__"
