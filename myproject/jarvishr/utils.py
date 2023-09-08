from googleapiclient.discovery import build

from google.oauth2 import service_account
from authentication.models import User


def getData(id):
    SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
    SERVICE_ACCOUNT_FILE = "key.json"
    creds = None
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )

    # The ID of a sample spreadsheet.
    SAMPLE_SPREADSHEET_ID = id

    service = build("sheets", "v4", credentials=creds)

    # Call the Sheets API
    sheet = service.spreadsheets()
    result = (
        sheet.values()
        .get(spreadsheetId=SAMPLE_SPREADSHEET_ID, range="sheetdata")
        .execute()
    )

    values = result.get("values", [])

    return result

