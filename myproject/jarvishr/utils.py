import gspread

from http.client import BAD_REQUEST
import json
import csv

from google.oauth2 import service_account
from googleapiclient.discovery import build

from .constants import SERVICE_ACCOUNT_JSON, WORKFORCE_HEADERS
from io import TextIOWrapper

def authenticate_with_google():
    """
    Runs authentication with google. Returns credentials.
    """
    SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

    SERVICE_ACCOUNT_FILE = json.loads(SERVICE_ACCOUNT_JSON, strict=False)
        
    return  service_account.Credentials.from_service_account_info(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )


def fetchGoogleSheet(spreadsheet_id):
    try:

        credentials = authenticate_with_google()
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

    # 1. Create google sheet for the given file
    SERVICE_ACCOUNT_FILE = json.loads(SERVICE_ACCOUNT_JSON, strict=False)
    gc = gspread.service_account_from_dict(SERVICE_ACCOUNT_FILE)
    sh = gc.create('workforce_user')
    sh.share('karim@jarvis-hr.com', perm_type='user', role='writer')
    # 2. Save link to created google sheet on user profile

    # 3. Return success


def validate_csv_headers(csv_file, expected_headers):
    """
    Validate the headers of a CSV file against the expected headers.

    Args:
        csv_file: An open CSV file.
        expected_headers: A list of expected header names.

    Returns:
        True if the headers match the expected headers, False otherwise.
    """
    opened_file = TextIOWrapper(csv_file.file, encoding=csv_file.charset)    
    # Read the first row of the CSV file (the header row)
    csv_reader = csv.reader(opened_file)
    header_row = next(csv_reader, None)

    # Check if the header row is None (empty CSV file)
    if header_row is None:
        return False

    # Compare the headers from the CSV with the expected headers
    return header_row == expected_headers


