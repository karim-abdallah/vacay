import boto3
from .templates import FORGET_PASSWORD_TEMPLATE, REGISTER_USER_TEMPLATE

ACCESS_KEY = 'AKIAVH77JYOVXV547FMB'
SECRET_ACCESS_KEY = '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'

ses_client = boto3.client(
    'ses',
    region_name='us-east-1',
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_ACCESS_KEY
)

s3_client = boto3.client(
    's3',
    region_name='us-east-1',
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_ACCESS_KEY
)

S3_BUCKET = 'vacay-assets'


def send_forget_password_email(recepient, link):

    template = FORGET_PASSWORD_TEMPLATE
    content = template.replace('reset_password_link', link)

    send_email(recepient, content, 'Forget Password Link')


def send_register_user_email(recepient, first_name):

    template = REGISTER_USER_TEMPLATE
    content = template.replace('first_name', first_name)

    send_email(recepient, content, 'Welcome to Vacay!')


def send_email(receipient, content, subject):
    response = ses_client.send_email(
        Destination={
            'ToAddresses': ['aliasghernooruddin@gmail.com', 'info@vacay.live'],
        },
        Message={
            'Body': {
                'Html': {
                    'Charset': 'UTF-8',
                    'Data': content,
                },
            },
            'Subject': {
                'Charset': 'UTF-8',
                'Data': subject,
            },
        },
        Source='info@vacay.live',
    )

    return response


def generate_presigned_url(username, file_name, file_type):
    path = f'users/{username}/profile/{file_name}'

    url = s3_client.generate_presigned_url('put_object',
                                           Params={
                                               'Bucket': S3_BUCKET,
                                               'Key': path,
                                               'ContentType': file_type,
                                           },
                                           ExpiresIn=360)
    return url
