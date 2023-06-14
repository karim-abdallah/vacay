from authentication.models import HolidaySetting, TimeOffSetting, BookedDays
from rest_framework import serializers


class TimeOffSettingSerializer(serializers.ModelSerializer):

    current_balance_days = serializers.FloatField()

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
            "balance_recorded_date",
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
        instance.balance_recorded_date = validated_data.get(
            "balance_recorded_date", instance.balance_recorded_date
        )

        instance.save()
        return instance


class HolidaySettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = HolidaySetting
        fields = "__all__"


class BookedDaysSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookedDays
        fields = "__all__"
