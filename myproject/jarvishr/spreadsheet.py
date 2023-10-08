from google.oauth2 import service_account
from googleapiclient.discovery import build
import json
from .constants import SERVICE_ACCOUNT_JSON

class SpreadSheet:
    def __init__(self,spreadsheet_id,sheet_title):
        self.spreadsheet_id = spreadsheet_id
        self.sheet_title = sheet_title
        
    def connect_sheet(self):
        try:
            SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]

            SERVICE_ACCOUNT_FILE = json.loads(SERVICE_ACCOUNT_JSON, strict=False)

            credentials = service_account.Credentials.from_service_account_info(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES
            )

            service = build("sheets", "v4", credentials=credentials)

            # Call the Sheets API
            sheets = service.spreadsheets()

            meta = sheets.get(spreadsheetId=self.spreadsheet_id).execute()

            # we try to fetch the name of first sheet
            google_sheets_meta = meta.get('sheets')

            return sheets, google_sheets_meta
        
        except Exception as e:
            return e
   
    def get_data(self):

        sheets, _ = self.connect_sheet()
        spreadsheet_data = []
        sheet_range = f"{self.sheet_title}!A1:Z1000"  # Assuming a maximum of 1000 rows and 26 columns
        # Call the Sheets API to get data from the sheet
        result = sheets.values().get(spreadsheetId=self.spreadsheet_id, range=sheet_range).execute()
        values = result.get('values', [])

        if values:
            # Assuming the first row contains headers
            headers = values[0]
            for row in values[1:]:
                row_data = dict(zip(headers, row))
                spreadsheet_data.append(row_data)
                
        return spreadsheet_data
    
    def append_row(self, rows_data):

        try:
            sheets, _ = self.connect_sheet()
            sheet_range = f"{self.sheet_title}!A:Z"  # Assuming you want to append to the end of the sheet
            result = sheets.values().get(spreadsheetId=self.spreadsheet_id, range=sheet_range).execute()
            values = result.get('values', [])
            if values:
                # Assuming the first row contains headers
                headers = values[0]

                if rows_data:
                    # Prepare the row data to be appended
                    rows_to_append = [[row_data.get(col, '') for col in headers] for row_data in rows_data]

                    
                    # Call the Sheets API to append the row
                    request = sheets.values().append(
                        spreadsheetId=self.spreadsheet_id,
                        range=sheet_range,
                        valueInputOption='RAW',
                        insertDataOption='INSERT_ROWS',
                        body={'values': rows_to_append}
                    )

                    request.execute()
                    return "Rows added successfully"
            
        except Exception as e:
            return e

    def edit_row(self, rows_data):
        try:
            sheets, _ = self.connect_sheet()
            sheet_range = f"{self.sheet_title}!A:Z"

            # Call the Sheets API to get all values from the sheet
            result = sheets.values().get(spreadsheetId=self.spreadsheet_id, range=sheet_range).execute()
            values = result.get('values', [])

            row_ids = [row["Employee ID"] for row in rows_data]
            
            if values:
                headers = values[0]
                for row_id, row_data in zip(row_ids, rows_data):
                    for i, row in enumerate(values[1:], start=2):  # Start from row 2 (index 1)
                        if row_id in row:  # Assuming 'row_id' is a key in the row data
                            # Update the row with the new data
                            values[i-1] = [row_data.get(col,None) for col in headers]
                            
                            
                # Prepare the body for the update request
                body = {'values': values}

                # Call the Sheets API to update the row
                request = sheets.values().update(
                    spreadsheetId=self.spreadsheet_id,
                    range=sheet_range,
                    valueInputOption='RAW',
                    body=body
                )

                request.execute()
            
            return "Rows edited successfully"

        except Exception as e:
            return e
        
    def get_row_number_by_id(self, result, target_id):
        # Call the Sheets API to get data from the sheet

        values = result.get('values', [])
        if not values:
            return None

        for i, row in enumerate(values):
            if target_id in row:  
                return i + 1  # Row numbers start from 1, so we add 1 to the index
            
        return None
    
    def delete_rows_by_ids(self, emp_ids):
        try:
            # Get the row numbers for the target IDs
            sheets, _ = self.connect_sheet()
            sheet_range = f"{self.sheet_title}!A:Z"

            # Call the Sheets API to get all values from the sheet
            result = sheets.values().get(spreadsheetId=self.spreadsheet_id, range=sheet_range).execute()
            values = result.get('values', [])

            if values:
                rows_to_delete = []

                for emp_id in emp_ids:
                    # Iterate through the values to find rows with the target emp_id
                    for i, row in enumerate(values[1:], start=2):
                        if emp_id in row:
                            rows_to_delete.append(i)

                # Prepare the requests to delete the rows
                requests = [
                    {
                        'deleteDimension': {
                            'range': {
                                'sheetId': 0,  # Use sheet_id instead of sheet_title
                                'dimension': 'ROWS',
                                'startIndex': row_number - 1,  # Adjust for 0-based indexing
                                'endIndex': row_number
                            }
                        }
                    }
                    for row_number in rows_to_delete
                ]

                request = {'requests': requests}

                # Delete the rows
                sheets.batchUpdate(
                    spreadsheetId=self.spreadsheet_id,
                    body=request
                ).execute()

                return 'Rows deleted successfully.'

        except Exception as e:
            return str(e)
        