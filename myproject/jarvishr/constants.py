from decouple import config

OPENAI_KEY = config('OPENAI_KEY')
SERVICE_ACCOUNT_JSON = config('SERVICE_ACCOUNT_JSON')
RETOOL_API_TOKEN = config('RETOOL_API_TOKEN')
RETOOL_CUSTOM_DOMAIN = config('RETOOL_CUSTOM_DOMAIN')
RETOOL_GROUP_ID = config('RETOOL_GROUP_ID')
RETOOL_EXTERNAL_IDENTIFIER = config('RETOOL_EXTERNAL_IDENTIFIER')
WORKFORCE_HEADERS = ["Employee Name", "Job Title", "Seniority Level", "Department", "Country", "City", "Gender", "Marital Status", "Date of Birth", "Nationality", "Start Date", "Termination Date", "Reason for Termination", "Yearly Base Salary"]