import openai
from authentication.models import Metric
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .constants import OPENAI_KEY
from .serializers import MetricsSerializer

openai.api_key = OPENAI_KEY

FILE_PATH = 'sample_data.csv' #file path

# Create your views here.
class ChatBotView(APIView):

    # permission_classes = [IsAuthenticated]

    def post(self, request):

        prompt = request.data['prompt']
        initial_conversation = request.data['initial_conversation']
 
        with open(FILE_PATH, 'r') as file: #open file
            file_content = file.read() #read file
            #user content from file
            prompt = f"Here are the statistics for the file:\n\n{file_content}\n\${prompt}"
            response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Choose an appropriate model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ] + initial_conversation
        )
            
        message = response.choices[0].message
        return Response( { "data": message}, status=status.HTTP_201_CREATED )

class MetricsView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        metrics = Metric.objects.all()
        serializer = MetricsSerializer(metrics, many=True)
        return Response(serializer.data)
