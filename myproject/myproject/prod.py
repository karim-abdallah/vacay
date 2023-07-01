# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['backend.vacay.live','*']

# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'vacay',
        'PASSWORD': 'Vacaydbadmin2023!',
        'HOST': 'vacay-db.cwx5iz62mons.us-east-1.rds.amazonaws.com',
        'PORT': '5433'
    }
}
