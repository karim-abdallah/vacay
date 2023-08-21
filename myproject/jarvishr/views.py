from django.shortcuts import render

# Create your views here.

import openai
openai.api_key = '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'
file_path = 'sample_data.csv' #file path
with open(file_path, 'r') as file: #open file
    file_content = file.read() #read file
    #user content from file
    prompt = f"Here are the statistics for the file:\n\n{file_content}\n\nWhat statistics can you provide?"
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",  # Choose an appropriate model
    messages=[
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": prompt},
    ]
)
print(response.choices[0].message['content'])