from decouple import config

ENVIRONMENT = config("VACAY_BACKEND_ENV")
AWS_REGION = config('AWS_REGION')
GOOGLE_REDIRECT_URL = config("GOOGLE_REDIRECT_URL")
GOOGLE_CLIENT_ID = config("GOOGLE_CLIENT_ID")
GOOGLE_OAUTH_URL_PREFIX = 'https://accounts.google.com/o/oauth2/v2/auth?'
GOOGLE_OAUTH_USER_URL='https://www.googleapis.com/oauth2/v2/userinfo'
GOOGLE_OAUTH_SCOPE = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
FACEBOOK_REDIRECT_URL = config("FACEBOOK_REDIRECT_URL")
FACEBOOK_CLIENT_ID=config("FACEBOOK_CLIENT_ID")
FACEBOOK_OAUTH_URL_PREFIX= 'https://www.facebook.com/v17.0/dialog/oauth?'
FACEBOOK_OAUTH_GRAPH_URL='https://graph.facebook.com/v17.0'
FACEBOOK_OAUTH_STATE= config('FACEBOOK_OAUTH_STATE')
FACEBOOK_CLIENT_SECRET = config('FACEBOOK_CLIENT_SECRET')
FACEBOOK_OAUTH_URL_FIELDS ='email,name,first_name,id,last_name,picture,middle_name,name_format,short_name'
