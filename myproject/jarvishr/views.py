from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import openai
# Create your views here.

openai.api_key = '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'

file_path = 'sample_data.csv' #file path


class ChatBotView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        prompt = request.data['prompt']

        with open(file_path, 'r') as file: #open file
            file_content = file.read() #read file
            #user content from file
            prompt = f"Here are the statistics for the file:\n\n{file_content}\n\${prompt}"
            response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Choose an appropriate model
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ]
        )

        return Response(
            {
                "detail": response.choices[0].message['content']},
                  status=status.HTTP_201_CREATED
        )
    
    