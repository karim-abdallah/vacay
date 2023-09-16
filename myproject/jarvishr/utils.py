import json

from google.oauth2 import service_account
from googleapiclient.discovery import build

from .constants import SERVICE_ACCOUNT_JSON


def fetchGoogleSheet(spreadsheet_id):
    try:

        SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

        SERVICE_ACCOUNT_FILE = json.loads(SERVICE_ACCOUNT_JSON, strict=False)
        
        credentials = service_account.Credentials.from_service_account_info(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )

        service = build("sheets", "v4", credentials=credentials)

        # Call the Sheets API
        sheets = service.spreadsheets()

        meta = sheets.get(spreadsheetId=spreadsheet_id).execute()

        # we try to fetch the name of first sheet
        google_sheets_meta = meta.get('sheets')

        # consolidated data from different sheets of google sheet
        consumer_data = []

        # iterate through all the sheets in a single google sheet and get data from it
        for sheet in google_sheets_meta:
            sheet_name = sheet['properties']['title']

            result = sheets.values().get(spreadsheetId=spreadsheet_id, range=sheet_name).execute()
        
            consumer_data = consumer_data +  result['values']

        return consumer_data

    except Exception as e:
        print(str(e))
        return None
