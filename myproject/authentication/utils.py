import boto3
from .templates import FORGET_PASSWORD_TEMPLATE, REGISTER_USER_TEMPLATE, SEND_INVITE_TEMPLATE
from .models import User

ses_client = boto3.client(
    "ses",
    region_name="us-east-1",
)

s3_client = boto3.client(
    "s3",
    region_name="us-east-1",
)

S3_BUCKET = "vacay-assets"


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


def generate_presigned_url(username, file_name, file_type):
    path = f"users/{username}/profile/{file_name}"

    url = s3_client.generate_presigned_url(
        "put_object",
        Params={
            "Bucket": S3_BUCKET,
            "Key": path,
            "ContentType": file_type,
        },
        ExpiresIn=360,
    )
    return url


def check_or_create_username(email):
    username = email.split("@")[0]
    count = User.objects.filter(username=username).count()

    if count > 0:
        username = username + str(count + 1)

    return username
