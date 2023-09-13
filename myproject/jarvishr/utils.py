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
        sheet = service.spreadsheets()

        result = sheet.values().get(spreadsheetId=spreadsheet_id, range="Sheet1").execute()

        return result

    except Exception as e:
        breakpoint()
        return None
