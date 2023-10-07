from decouple import config

OPENAI_KEY = config('OPENAI_KEY')
SERVICE_ACCOUNT_JSON = config('SERVICE_ACCOUNT_JSON')

WORKFORCE_HEADERS = ["Employee Name", "Job Title", "Seniority Level", "Department", "Country", "City", "Gender", "Marital Status", "Date of Birth", "Nationality", "Start Date", "Termination Date", "Reason for Termination", "Yearly Base Salary"]