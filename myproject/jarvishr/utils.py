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
        spreadsheet_data = []

        # iterate through all the sheets in a single google sheet and get data from it
        for sheet in google_sheets_meta:
            sheet_name = sheet['properties']['title']

            result = sheets.values().get(spreadsheetId=spreadsheet_id, range=sheet_name).execute()
        
            spreadsheet_data = spreadsheet_data +  result['values']

        return spreadsheet_data

    except Exception as e:
        return None


def create_workforce_database_entry(csv_file, user_id):
    """
    Creates a google sheets entry for the given file.
    Links the entry to the user's profile.

    Raises error if headers for CSV don't match expected headers.

    TODO: Create looker report with link.
    """

    # 1. Validate CSV headers otherwise raise error
    

    # 2. Create google sheet for the given file

    # 3. Save link to created google sheet on user profile

    # 4. Return success


