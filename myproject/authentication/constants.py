from decouple import config

ENVIRONMENT = config("VACAY_BACKEND_ENV")
AWS_REGION = config('AWS_REGION')
GOOGLE_REDIRECT_URL = config("GOOGLE_REDIRECT_URL")
GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID")
GOOGLE_OAUTH_URL_PREFIX = 'https://accounts.google.com/o/oauth2/v2/auth?'
GOOGLE_OAUTH_USER_URL='https://www.googleapis.com/oauth2/v2/userinfo'