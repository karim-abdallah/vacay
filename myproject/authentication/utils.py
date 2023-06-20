import json
from urllib.parse import urlencode

import boto3
import requests
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.hashers import make_password

from .constants import (AWS_REGION, ENVIRONMENT, FACEBOOK_CLIENT_ID,
                        FACEBOOK_CLIENT_SECRET, FACEBOOK_OAUTH_STATE,
                        FACEBOOK_OAUTH_URL_PREFIX, FACEBOOK_REDIRECT_URL,
                        GOOGLE_CLIENT_ID, GOOGLE_OAUTH_SCOPE, FACEBOOK_OAUTH_GRAPH_URL, FACEBOOK_OAUTH_URL_FIELDS,
                        GOOGLE_OAUTH_URL_PREFIX, GOOGLE_OAUTH_USER_URL,
                        GOOGLE_REDIRECT_URL)
from .models import User
from .templates import (FORGET_PASSWORD_TEMPLATE, REGISTER_USER_TEMPLATE,
                        SEND_INVITE_TEMPLATE)

ses_client = boto3.client(
    "ses",
    region_name=AWS_REGION,
)


def send_forget_password_email(recepient, link):

    template = FORGET_PASSWORD_TEMPLATE
    template = template.replace('reset_password_link', link)
    recepients = ['info@vacay.live']

    send_email(recepient, recepients, template, 'Forget Password Link')


def send_register_user_email(recepient, first_name):

    template = REGISTER_USER_TEMPLATE
    template = template.replace('first_name', first_name)
    recepients = ['info@vacay.live']

    send_email(recepient, recepients, template, 'Welcome to Vacay!')


def send_invite_email(receipents):
    template = SEND_INVITE_TEMPLATE
    receipient = 'info@vacay.live'

    send_email(receipient, receipents, template, 'You have been invited')


def send_email(to_address, cc_addresses, content, subject):

    if ENVIRONMENT == "local":
        return True

    response = ses_client.send_email(
        Destination={
            'ToAddresses': [to_address],
            'CcAddresses': cc_addresses,
        },
        Message={
            "Body": {
                "Html": {
                    "Charset": "UTF-8",
                    "Data": content,
                },
            },
            "Subject": {
                "Charset": "UTF-8",
                "Data": subject,
            },
        },
        Source="info@vacay.live",
    )

    return response


def check_or_create_username(email):
    username = email.split("@")[0]
    count = User.objects.filter(username__icontains=username).count()

    if count > 0:
        username = username + str(count + 1)

    return username


def get_google_oauth_link():

    encoded_params = urlencode({
        'client_id': GOOGLE_CLIENT_ID,
        'redirect_uri': GOOGLE_REDIRECT_URL,
        'response_type': 'token',
        'scope': GOOGLE_OAUTH_SCOPE,
        'access_type': 'online'
    })

    encoded_url = GOOGLE_OAUTH_URL_PREFIX + encoded_params

    return encoded_url


def get_google_oauth_user_info(access_token):
    payload = {'access_token': access_token}  # validate the token

    result = requests.get(GOOGLE_OAUTH_USER_URL, params=payload)

    data = json.loads(result.text)

    return data


def create_google_user_object(data):
    user = User()
    user.username = check_or_create_username(data["email"])
    user.email = data['email']
    user.profile_pic = data['picture']
    user.first_name = data['given_name']
    user.last_name = data['family_name']
    user.provider = 'google'
    user.password = generate_random_password()

    return user


def generate_random_password():
    # provider random default password
    return make_password(BaseUserManager().make_random_password())


def get_facebook_oauth_link():

    encoded_params = urlencode({
        'client_id': FACEBOOK_CLIENT_ID,
        'redirect_uri': FACEBOOK_REDIRECT_URL,
        'state': FACEBOOK_OAUTH_STATE
    })

    encoded_url = FACEBOOK_OAUTH_URL_PREFIX + encoded_params

    return encoded_url


def get_facebook_oauth_user_info(code):

    data = get_facebook_access_token(code)

    if 'error' in data:
        return data

    else:
        access_token = data['access_token']

        data = get_facebook_oauth_user_id(access_token)

        if 'error' in data:
            return data

        else:
            data = get_facebook_oauth_verified_user(access_token, data['id'])

            if 'error' in data:
                return data

    return data


def get_facebook_access_token(code):

    encoded_params = urlencode({
        'client_id': FACEBOOK_CLIENT_ID,
        'redirect_uri': FACEBOOK_REDIRECT_URL,
        'code': code,
        'client_secret': FACEBOOK_CLIENT_SECRET
    })

    encoded_url = '{}/oauth/access_token?{}'.format(
        FACEBOOK_OAUTH_GRAPH_URL, encoded_params)

    result = requests.get(encoded_url)

    data = json.loads(result.text)

    return data


def get_facebook_oauth_user_id(access_token):

    url = '{}/me?access_token={}'.format(
        FACEBOOK_OAUTH_GRAPH_URL, access_token)

    result = requests.get(url)

    data = json.loads(result.text)

    return data


def get_facebook_oauth_verified_user(access_token, id):

    url = '{}/{}?fields={}&access_token={}'.format(
        FACEBOOK_OAUTH_GRAPH_URL, id, FACEBOOK_OAUTH_URL_FIELDS, access_token)

    result = requests.get(url)

    data = json.loads(result.text)

    return data


def create_facebook_user_object(data):
    user = User()
    user.username = check_or_create_username(data["email"])
    user.email = data['email']
    user.profile_pic = parse_facebook_picture(data['picture'])
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.provider = 'facebook'
    user.password = generate_random_password()

    return user


def parse_facebook_picture(obj):
    try:
        return obj['data']['url']
    except:
        return None


def serialize_provider_object(data,provider):
    if provider == 'google':
        serialized_user =  create_google_user_object(data)
        return serialized_user

    elif provider == 'facebook':
        serialized_user = create_facebook_user_object(data)
        return serialized_user
    
    return None
        