from authentication.models import Metric
from rest_framework import serializers

class MetricsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metric
        fields = "__all__"
