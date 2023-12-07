import openai
from rest_framework import status, serializers
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from authentication.models import Metric, Company, User
from io import TextIOWrapper

from .constants import OPENAI_KEY, WORKFORCE_HEADERS
from .serializers import MetricsSerializer
from .utils import create_workforce_database_entry, fetchGoogleSheet, validate_csv_headers, get_retool_embed_link
from .spreadsheet import SpreadSheet

openai.api_key = OPENAI_KEY

tuning_prompt = """You are a helpful assistant that will only answer questions 
relative to the previously given file or HR related questions. 
Please limit your answers to 50 words, and don't share any code if you use any to
make computations."""


class ChatBotView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        field = data['field']

        if field == 'recruitment':
            spreadsheet_id = request.user.company.gsheet_recruitment_id
        else:
            spreadsheet_id = request.user.company.gsheet_workforce_id
        
        prompt = data["prompt"]
        initial_conversation = data["initial_conversation"]

        result = fetchGoogleSheet(spreadsheet_id)

        prompt = f"Here are the statistics for the file:\n\n{result}\n\${prompt}"

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Choose an appropriate model
            messages=[
                {
                    "role": "system",
                    "content": tuning_prompt,
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
    

class SheetView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            field = request.GET.get('field')

            if field == 'recruitment':
                spreadsheet_id = request.user.company.gsheet_recruitment_id
                sheet_title = request.user.company.gsheet_recruitment_name
            else:
                spreadsheet_id = request.user.company.gsheet_workforce_id
                sheet_title = request.user.company.gsheet_workforce_name

            sheet = SpreadSheet(spreadsheet_id, sheet_title)
            spreadsheet_data = sheet.get_data()

            return Response(spreadsheet_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        try:
            data = request.data
            field = data['field']

            if field == 'recruitment':
                spreadsheet_id = request.user.company.gsheet_recruitment_id
                sheet_title = request.user.company.gsheet_recruitment_name
            else:
                spreadsheet_id = request.user.company.gsheet_workforce_id
                sheet_title = request.user.company.gsheet_workforce_id

            rows_data = data['rows_data']

            if rows_data and isinstance(rows_data, list):
                sheet = SpreadSheet(spreadsheet_id, sheet_title)
                resp = sheet.append_row(rows_data)
                return Response({"message": resp}, status=status.HTTP_200_OK)
            return Response({"error": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        try:
            data = request.data
            field = data['field']

            if field == 'recruitment':
                spreadsheet_id = request.user.company.gsheet_recruitment_id
                sheet_title = request.user.company.gsheet_recruitment_name
            else:
                spreadsheet_id = request.user.company.gsheet_workforce_id
                sheet_title = request.user.company.gsheet_workforce_id

            rows_data = data['rows_data']

            if rows_data and isinstance(rows_data, list):
                sheet = SpreadSheet( spreadsheet_id, sheet_title)
                resp = sheet.edit_row(rows_data)
                return Response({"message": resp}, status=status.HTTP_200_OK)
            return Response({"error": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            data = request.data
            field = data['field']

            if field == 'recruitment':
                spreadsheet_id = request.user.company.gsheet_recruitment_id
                sheet_title = request.user.company.gsheet_recruitment_name
            else:
                spreadsheet_id = request.user.company.gsheet_workforce_id
                sheet_title = request.user.company.gsheet_workforce_id

            rows_data = data['rows_data']

            if rows_data and isinstance(rows_data, list):
                sheet = SpreadSheet( spreadsheet_id, sheet_title)
                resp = sheet.delete_rows_by_ids(rows_data)
                return Response({"message": resp}, status=status.HTTP_200_OK)
            return Response({"error": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WorkforceView(APIView):

    permission_classes = [IsAuthenticated]
    file_parser = (MultiPartParser)

    def post(self, request):
        """
        Create workforce database entry for a given business user
        """
        # 1. Fetch CSV
        csv_file = request.data['file']
        opened_file = TextIOWrapper(csv_file.file, encoding='utf-8')
        user_id = request.user.id
        company_id = get_object_or_404(User, id=user_id).id
        company = get_object_or_404(Company, id=company_id)

        # Validate
        if not validate_csv_headers(opened_file, WORKFORCE_HEADERS):
            raise serializers.ValidationError("Invalid headers on CSV file.")

        # 2. Call helper
        create_workforce_database_entry(opened_file, company)

        # 3. Return success
        return Response({"data": "Success"}, status=status.HTTP_201_CREATED)


class RetoolEmbedAuth(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self,request):

        retool_table = request.GET.get('type')

        if retool_table == 'recruitment':
            retool_app_id = request.user.company.gsheet_recruitment_id
        else:
            retool_app_id = request.user.company.gsheet_workforce_id

        embed_link = get_retool_embed_link(retool_app_id)

        if embed_link['status'] == True:

            return Response({"data": embed_link['data']}, status=status.HTTP_200_OK)

        else:

            return Response({"data": embed_link['error']}, status=status.HTTP_400_BAD_REQUEST)