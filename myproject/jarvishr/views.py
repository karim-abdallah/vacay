import openai
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import Metric

from .constants import OPENAI_KEY
from .serializers import MetricsSerializer
from .utils import fetchGoogleSheet

openai.api_key = OPENAI_KEY

# Create your views here.
class ChatBotView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        prompt = request.data["prompt"]
        initial_conversation = request.data["initial_conversation"]
       
        sheet_id = request.user.data_source_url.split('/')
        
        result = fetchGoogleSheet(sheet_id[5])

        prompt = f"Here are the statistics for the file:\n\n{result}\n\${prompt}"

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Choose an appropriate model
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that will only answer questions relative to the previously given file or HR related questions.",
                },
                {"role": "user", "content": prompt},
            ]
            + initial_conversation,
        )

        message = response.choices[0].message
        return Response({"data": message}, status=status.HTTP_201_CREATED)


class MetricsView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        metrics = Metric.objects.all()
        serializer = MetricsSerializer(metrics, many=True)
        return Response(serializer.data)
